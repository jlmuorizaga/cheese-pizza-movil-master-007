import { AlertController, NavController } from '@ionic/angular';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { StripeService } from 'src/app/services/stripe.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { DatosPagoStripe } from 'src/app/model/DatosPagoStripe';
import { PAGINA_SELECCION_TIPO_ENTREGA } from 'src/app/constantes/constantes';
import { ConversorPedido } from 'src/app/model/ConversorPedido';
import { PedidoNube } from 'src/app/model/PedidoNube';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonCol, IonRow, IonGrid, IonSpinner],
})
export class PaymentFormComponent implements OnInit, AfterViewInit {
  @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;

  cardError!: string;
  card: any;

  botonPagoDeshabilitado: boolean;

  pedidoPregrabado!: PedidoNube;
  existePedidoPregrabado!: boolean;

  // LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
  // LGDD fin

  puntoVenta: PuntoVenta;
  constructor(
    private stripeService: StripeService,
    public alertController: AlertController,
    private navCtrl: NavController,
    private pedidoSvc: PedidoService
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
    this.botonPagoDeshabilitado = false;
  }

  ngOnInit() {
    this.initStripe();
    this.botonPagoDeshabilitado = false;

    this.pedidoPregrabado = null as any;
    this.existePedidoPregrabado = false;
  }

  ngAfterViewInit() {
    this.card = this.stripeService.initCardElement(
      this.puntoVenta.sucursalSeleccionada
    );
    this.card.cardNumber.mount('#card-number');
    this.card.cardExpiry.mount('#card-expiry');
    this.card.cardCvc.mount('#card-cvc');
    this.card.postalCode.mount('#postal-code');
    this.card.cardNumber.addEventListener('change', this.onChange.bind(this));
    this.card.cardExpiry.addEventListener('change', this.onChange.bind(this));
    this.card.cardCvc.addEventListener('change', this.onChange.bind(this));
    this.card.postalCode.addEventListener('change', this.onChange.bind(this));
  }

  onChange(event: any) {
    const { error } = event;
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null as any;
    }
  }

  initStripe() {
    // Lógica para inicializar Stripe Elements y montar el elemento de tarjeta
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    // Lógica para manejar la creación del token o PaymentMethod y enviarlo al servidor
  }

  async handleForm(e: Event) {
    //Deshabilita el botón para que no se envíe más de un pago
    this.botonPagoDeshabilitado = true;

    e.preventDefault(); // Esto evita que el formulario se envíe de la manera tradicional.
    let pedidoNube = ConversorPedido.generaPedidoNube(this.puntoVenta);
    //Se envía el pedido previo al pago
    this.enviarPedido(pedidoNube);
  }

  enviarPedido(pedidoNube: PedidoNube) {
    console.log('Enviando pedido antes del pago');
    //Si el pedido no se ha pregrabado, pregrabar y luego pagar
    //Si ya estaba pregrabado, entonces ir directamente al pago
    if (this.existePedidoPregrabado) {
      //Ir directamente al pago
      this.pagarStripe(this.pedidoPregrabado);
    } else {
      //Pregrabar y luego ir al pago
      //Enviando pedido a la nube
      // Realizar la solicitud POST
      this.pedidoSvc.insertaPedidoNube(pedidoNube).subscribe({
        next: (res: any) => {
          let respuesta = res;
          console.log(respuesta);
          console.log('Inserción antes de pago exitoso', pedidoNube.idPedido);
          this.pedidoPregrabado = pedidoNube;
          this.existePedidoPregrabado = true;
          //this.mensajePedidoRegistrado();
          //Se realiza el pago por Stripe
          this.pagarStripe(pedidoNube);
        },
        error: (error: any) => {
          // LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          // LGDD fin
          this.mensajeErrorConexion();
          console.log('Ocurrió un error al enviar el pedido:');
          console.log(error);
        },
      });
    }
  }

  async pagarStripe(pedidoNube: PedidoNube) {
    console.log('Realizando el pago por Stripe');
    //Intentando realizar el pago por stripe

    const { token, error } = await this.stripeService.createToken(
      this.card.cardNumber
    );

    if (error) {
      console.log('Something is wrong:', error);
      // Aquí manejas el error, por ejemplo, mostrando un mensaje al usuario.
      this.mensajeErrorTarjeta(error.message);
      //Habilita el botón de pago para que se pueda intentar nuevamente
      this.botonPagoDeshabilitado = false;
    } else {
      console.log('Success! Token:', token.id);

      // Aquí envías el token.id a tu servidor para procesar el pago.
      let dps = new DatosPagoStripe();
      dps.claveSucursal = pedidoNube.claveSucursal;
      dps.amount = pedidoNube.montoTotal * 100; //El monto debe ser en centavos
      dps.token = token.id;
      dps.description =
        'CHP ' + pedidoNube.datosSucursal + ', ' + pedidoNube.resumenPedido;

      //Enviando token y datos para el pago
      // LGDD ini
      this.verificandoConexion = true;
      this.showSpinner = true;
      // LGDD fin
      this.stripeService.procesaPagoStripe(dps).subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.success) {
            console.log('Pago por Stripe exitoso', pedidoNube.idPedido);
            let urlRecibo = res.charge.receipt_url;
            console.log(urlRecibo);
            this.actualizaPedidoPago(pedidoNube.idPedido, urlRecibo);

            this.puntoVenta.limpiaTipoEntrega();
            this.navCtrl.navigateRoot(PAGINA_SELECCION_TIPO_ENTREGA);

            this.mensajePagoExitoso();
          } else {
            this.mensajeFalloPago();
            //Habilita el botón de pago para que se pueda intentar nuevamente
            this.botonPagoDeshabilitado = false;
          }
        },
        error: (error: any) => {
          // LGDD ini
          this.verificandoConexion = false;
          this.showSpinner = false;
          this.mensajeErrorConexion();
          // LGDD fin
          console.log('Error al procesar pago en stripe');
          console.log(error);
          // LGDD ini
          //          this.mensajeFalloPago();
          // LGDD fin
          //Habilita el botón de pago para que se pueda intentar nuevamente
          this.botonPagoDeshabilitado = false;
        },
      });
    }

    //Termino de pago por stripe
  }

  actualizaPedidoPago(idPedido: string, urlRecibo: string) {
    console.log('Actualizando pedido con pago');
    //Obtiene el nuevo número del pedido
    this.pedidoSvc.obtieneNuevoNumeroPedido().subscribe({
      next: (res: any) => {
        let nuevoNumero: number = res.numeroPedido;

        // Realizar la solicitud PUT de actualización del pedido
        this.pedidoSvc
          .actualizaEstatusPedidoNubePagado(nuevoNumero, idPedido, urlRecibo)
          .subscribe({
            next: (res: any) => {
              this.pedidoPregrabado = null as any;
              this.existePedidoPregrabado = false;
              console.log('Actualización de estatus de pago exitoso', idPedido);
              let respuesta = res;
              console.log(respuesta);
              this.mensajePedidoRegistrado();
            },
            error: (error: any) => {
              // LGDD ini
              this.verificandoConexion = false;
              this.showSpinner = false;
              // LGDD fin
              this.mensajeErrorConexion();
              console.log('Ocurrió un error al actualizar el pago del pedido:');
              console.log(error);
            },
          });
      },
      error: (error: any) => {
        // LGDD ini
        this.verificandoConexion = false;
        this.showSpinner = false;
        // LGDD fin
        this.mensajeErrorConexion();
        console.log('Ocurrió un error al actualizar el pago del pedido:');
        console.log(error);
      },
    });
  }

  async mensajePagoExitoso() {
    const alert = await this.alertController.create({
      header: 'Pago exitoso',
      message: 'Se ha procesado exitosamente tu pago',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeFalloPago() {
    const alert = await this.alertController.create({
      header: 'Fall\u00f3 pago',
      message:
        'No se pudo procesar tu pago, revisa los datos de tu tarjeta, aseg\u00farate que tengas fondos suficientes e intenta nuevamente',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeErrorTarjeta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: mensaje,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajePedidoRegistrado() {
    const aviso = await this.alertController.create({
      header: 'Pedido registrado',
      message: 'Se ha enviado tu pedido a la sucursal',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Salió del Alert');
            //Limpiando el pedido
            this.puntoVenta.reiniciaPedido();
            //this.navCtrl.navigateForward(Constantes.PAGINA_SELECCION_TIPO_ENTREGA);
          },
        },
      ],
    });

    aviso.backdropDismiss = false;
    aviso.onclick;
    await aviso.present();
  }

  async mensajeErrorConexion() {
    const alert = await this.alertController.create({
      header: 'Error de conexi\u00f3n',
      message:
        'No pudimos conectarnos a los servidores de Cheese Pizza, ' +
        'por favor revisa tu conexi\u00f3n a Internet e intenta de nuevo.',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Aquí defines lo que quieres que haga tu función al presionar OK
            this.ngOnInit();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
