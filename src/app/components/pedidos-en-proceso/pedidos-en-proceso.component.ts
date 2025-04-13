import { NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { PedidoProceso } from 'src/app/model/PedidoProceso';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { PedidoService } from 'src/app/services/pedido.service';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
} from '@ionic/angular/standalone';
import { concat, delay, of, Subscription, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-pedidos-en-proceso',
  templateUrl: './pedidos-en-proceso.component.html',
  styleUrls: ['./pedidos-en-proceso.component.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonProgressBar,
  ],
})
export class PedidosEnProcesoComponent implements OnInit, OnDestroy {
  puntoVenta: PuntoVenta;
  pedidosProceso!: PedidoProceso[];
  mensaje!: string;

  private intervaloSubscription: Subscription | null = null;

  constructor(
    private navCtrl: NavController,
    private pedidoSrv: PedidoService
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Pedidos en proceso');
    let idCliente = this.puntoVenta.cliente.idCliente;

    // Crear una combinación de temporizadores para manejar la lógica del intervalo
    const inicioInmediato = of(null).pipe(delay(100)); // Primera llamada después de una décima de segundo
    const intervaloRegular = timer(0, 5000); // Subsecuentes llamadas cada 5 segundos

    // Combinar los dos temporizadores
    const ciclo = concat(inicioInmediato, intervaloRegular);

    // Configurar el intervalo para realizar la solicitud cada 5 segundos
    this.intervaloSubscription = ciclo
      .pipe(
        switchMap(() => this.pedidoSrv.obtenerPedidosEnProceso(idCliente)) // Llamada al servicio
      )
      .subscribe({
        next: (res: PedidoProceso[]) => {
          //console.log('Leyendo pedidos en proceso');
          this.pedidosProceso = res;
          if (this.pedidosProceso.length === 1) {
            this.mensaje = 'Tienes un pedido en proceso';
          } else if (this.pedidosProceso.length > 1) {
            this.mensaje = 'Tienes varios pedidos en proceso';
          } else {
            this.mensaje = '';
          }
        },
        error: (error) => {
          console.log('Error al consultar los pedidos en proceso', error);
        },
      });
  }

  ngOnDestroy(): void {
    // Detener la suscripción al salir de la página
    if (this.intervaloSubscription) {
      this.intervaloSubscription.unsubscribe();
    }
  }

  abreDatosPedido(idPedido: string) {
    console.log('Pasa a datos pedido ' + idPedido);
    this.navCtrl.navigateForward(['/pedido-proceso-datos'], {
      queryParams: {
        idPedido: idPedido,
      },
    });
  }
}
