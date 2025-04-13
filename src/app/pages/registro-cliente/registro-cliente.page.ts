import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonLabel, IonItem } from '@ionic/angular/standalone';
import { DomicilioCliente } from 'src/app/model/domicilioCliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { DataService } from 'src/app/services/data.service';
import { NavController } from '@ionic/angular';
import { Utilerias } from 'src/app/utilerias/Utilerias';
import { ClienteRegistro } from 'src/app/model/ClienteRegistro';
import { PAGINA_LOGIN } from 'src/app/constantes/constantes';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
  standalone: true,
  imports: [IonItem,
    IonLabel,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonBackButton,
    IonButtons,
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
export class RegistroClientePage implements OnInit {
  correoValidado: string = '';
  domicilios: DomicilioCliente[] = [];
  formularioCliente!: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private clienteSvc: ClienteService,
    private dataService: DataService,
    private navCtrl: NavController
  ) {
    this.formularioCliente = this.fb.group({
      contrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirmaContrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      nombre: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{3}\d{3}\d{4}$/),
      ]),
    });
  }

  ngOnInit() {
    this.correoValidado = this.dataService.getCorreoRegistro();
    console.log('Correo validado: ', this.correoValidado);
    if (!this.correoValidado) {
      this.navCtrl.navigateRoot(PAGINA_LOGIN);
    }
  }

  registraCliente() {
    //Registro del cliente
    console.log('Se registrará el cliente');
    var f = this.formularioCliente.value;
    if (this.formularioCliente.invalid) {
      this.mensajeDatosIncompletos();
      return;
    }
    //Validando confirmación de contraseña
    let errorConfirmacion = false;
    let mensajeNoConfirmado = '';
    let conexionMensaje = '';
    if (f.contrasenia !== f.confirmaContrasenia) {
      errorConfirmacion = true;
      mensajeNoConfirmado += conexionMensaje + 'contrase\u00f1a';
    }
    if (errorConfirmacion) {
      this.mensajeDatosNoConfirmados(mensajeNoConfirmado);
      return;
    }

    //Validando nuevamente que el correo no está registrado
    this.clienteSvc.leeExisteCorreo(this.correoValidado).subscribe({
      next: (res: any) => {
        if (res.existe != '0') {
          console.log('El correo ya existe...');
          this.mensajeCorreo(
            'Error de registro',
            'El correo ya existe en los registros de Cheese Pizza. No puede haber dos registros con el mismo correo. Por favor revise su correo y, si es correcto, utilice su cuenta existente para ingresar a la aplicaci\u00f3n.'
          );
        } else {
          //El correo no existe, por tanto se registra
          this.realizaRegistroCliente(f);
        }
      },
      error: (error: any) => {
        this.mensajeErrorConexion();
        console.log('Error al verificar si existe correo:');
        console.log(error);
      },
    });
  }

  private realizaRegistroCliente(f: any) {
    const cliente: ClienteRegistro = new ClienteRegistro();
    cliente.idCliente = Utilerias.generaID();
    cliente.fechaRegistro = Utilerias.fechaActual();
    cliente.correoElectronico = this.correoValidado;
    cliente.contrasenia = f.contrasenia;
    cliente.nombre = f.nombre;
    cliente.telefono = f.telefono;
    cliente.activo = 'S';

    //Se grabará el cliente en el servidor
    // Realizar la solicitud POST
    this.clienteSvc.insertaRegistroCliente(cliente).subscribe({
      next: (res: any) => {
        console.log(res);
        this.mensajeRegistroExitoso();
      },
      error: (error: any) => {
        this.mensajeErrorConexion();
        console.log('Ocurrió un error: ' + error);
      },
    });
  }

  async mensajeDatosIncompletos() {
    const alert = await this.alertController.create({
      header: 'Datos incompletos',
      message: 'Faltan datos del cliente',
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeDatosNoConfirmados(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos no confirmados',
      message: 'No coindiden los datos de ' + mensaje,
      buttons: ['Aceptar'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  async mensajeRegistroExitoso() {
    const aviso = await this.alertController.create({
      header: 'Datos registrados',
      message: 'Se han registrado tus datos en Cheese Pizza M\u00f3vil',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log(
              'Salió del Alert de registro de datos del cliente exitoso'
            );
            //Continuando con el proceso del login
            this.navCtrl.navigateRoot(PAGINA_LOGIN);
          },
        },
      ],
    });
    aviso.backdropDismiss = false;
    aviso.onclick;
    await aviso.present();
  }

  async mensajeCorreo(encabezado: string, texto: string) {
    const alert = await this.alertController.create({
      header: encabezado,
      message: texto,
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
            //this.registraCliente();
            this.ngOnInit();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
