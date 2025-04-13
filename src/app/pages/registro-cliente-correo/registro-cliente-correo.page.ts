import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  AlertController,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonItem,
} from '@ionic/angular/standalone';
import { ClienteService } from 'src/app/services/cliente.service';
import { CorreoService } from 'src/app/services/correo.service';
import { DataService } from 'src/app/services/data.service';
import { NavController } from '@ionic/angular';
import { Utilerias } from 'src/app/utilerias/Utilerias';
import { DatosCorreo } from 'src/app/model/DatosCorreo';
import { PuntoVenta } from 'src/app/model/PuntoVenta';

@Component({
  selector: 'app-registro-cliente-correo',
  templateUrl: './registro-cliente-correo.page.html',
  styleUrls: ['./registro-cliente-correo.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonInput,
  ],
})
export class RegistroClienteCorreoPage implements OnInit {
  formularioCorreoCliente!: FormGroup;
  verificacionEnviada: boolean = false;
  //codigoVerificacion: string = 'e8217896-c41f-474e-a853-4c85aacd4fd4';
  codigoVerificacionCapturado!: number;
  codigoEnviado: boolean = false;
  textoBoton: string = 'Continuar';
  correoValidado: string = '';

  puntoVenta: PuntoVenta;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private clienteSvc: ClienteService,
    private correoSvc: CorreoService,
    private dataService: DataService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
    this.formularioCorreoCliente = this.fb.group({
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      confirmaCorreoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  ngOnInit() {
    console.log('Página registro de correo');
    this.codigoEnviado = false;
  }

  verificaCorreo() {
    var f = this.formularioCorreoCliente.value;
    if (this.formularioCorreoCliente.invalid) {
      this.mensajeRegistro(
        'Datos incompletos',
        'Por favor escribe el correo con una estructura v\u00e1lida'
      );
      return;
    }
    let correo = f.correoElectronico;
    let correoVerifica = f.confirmaCorreoElectronico;
    if (correo != correoVerifica) {
      this.mensajeRegistro(
        'Datos no coincidentes',
        'El correo no coincide, por favor verifica la escritura'
      );
      return;
    }

    //Verificando que el correo no esté previamente registrado
    this.clienteSvc.leeExisteCorreo(f.correoElectronico).subscribe({
      next: (res: any) => {
        if (res.existe != '0') {
          console.log('El correo ya existe...');
          this.mensajeRegistro(
            'Error de registro',
            'El correo ya existe en los registros de Cheese Pizza. No puede haber dos registros con el mismo correo. Por favor revisa tu correo y, si es correcto, utiliza tu cuenta existente para ingresar a la aplicaci\u00f3n.'
          );
        } else {
          //El correo no está registrado, procede con la siguiente parte del registro
          //Verificar correo real (con código enviado por correo)
          this.puntoVenta.codigoVerificacion =
            Utilerias.generaCodigoVerificacion();

          let datosCorreo = new DatosCorreo();
          datosCorreo.correo = correo;
          datosCorreo.asunto =
            'C\u00f3digo de verificaci\u00f3n Cheese Pizza M\u00f3vil';
          datosCorreo.codigoVerificacion = this.puntoVenta.codigoVerificacion;
          this.correoSvc.verificaCorreo(datosCorreo).subscribe({
            next: (res: any) => {
              this.codigoEnviado = true;
              this.mensajeRegistro(
                'C\u00f3digo enviado',
                'Hemos enviado un c\u00f3digo de verificaci\u00f3n a tu correo'
              );
              this.textoBoton = 'Volver a enviar c\u00f3digo';
              this.correoValidado = correo;
            },
            error: (error: any) => {
              this.mensajeErrorConexion();
              console.log('Error al enviar código de verificación del correo');
              console.log(error);
            },
          });
        }
      },
      error: (error: any) => {
        this.mensajeErrorConexion();
        console.log('Error al verificar si existe el correo');
        console.log(error);
      },
    });
  }

  verificaCodigo() {
    //Verificando que el código capturado sea igual al código enviado
    //console.log('Código enviado: [', this.codigoVerificacion,']');
    //console.log('Código capturado: [', this.codigoVerificacionCapturado,']');
    if (this.codigoVerificacionCapturado) {
      let codigoVerificacionCapturadoStr =
        this.codigoVerificacionCapturado.toString();
      if (
        this.puntoVenta.codigoVerificacion ===
        codigoVerificacionCapturadoStr.trim()
      ) {
        console.log('Código correcto');
        this.dataService.setCorreoRegistro(this.correoValidado);
        this.navCtrl.navigateForward('/registro-cliente');
      } else {
        console.log('Código incorrecto');
        this.mensajeRegistro(
          'C\u00f3digo incorrecto',
          'El c\u00f3digo es incorrecto, por favor vuelve a escribirlo'
        );
      }
    } else {
      console.log('Código nulo');
      this.mensajeRegistro(
        'C\u00f3digo inv\u00e1lido',
        'El c\u00f3digo es incorrecto, por favor captura un c\u00f3digo v\u00e1lido'
      );
    }
  }

  async mensajeRegistro(encabezado: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: encabezado,
      message: mensaje,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
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
            this.verificaCorreo();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
