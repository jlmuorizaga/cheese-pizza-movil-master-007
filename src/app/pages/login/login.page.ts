import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
} from '@ionic/angular/standalone';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/model/cliente';
import {
  CLIENTE_LOCAL_STORE_ID,
  PAGINA_SELECCION_REGION,
} from 'src/app/constantes/constantes';
import { Credenciales } from 'src/app/model/Credenciales';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonInput,
  ],
})
export class LoginPage implements OnInit {
  errorMessage: string = 'Mensaje de error';

  puntoVenta: PuntoVenta;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteSvc: ClienteService,
    private navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      sesionAbierta: [false],
    });
  }

  ngOnInit() {
    console.log('Página de login');
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      let credenciales = new Credenciales();
      credenciales.correo = credentials.email;
      credenciales.contrasenia = credentials.password;
      console.log('Credenciales:', credenciales);

      this.clienteSvc
        .verificaAccesoCliente(credenciales)

        .subscribe({
          next: (response: any) => {
            console.log('Inicio de sesión exitoso', response);
            //Obteniendo datos del cliente
            let cliente: Cliente = new Cliente(
              response.cliente.id_cliente,
              response.cliente.correo_electronico,
              response.cliente.nombre,
              response.cliente.telefono,
              response.cliente.fecha_registro,
              response.cliente.activo
            );

            cliente.contrasenia = credenciales.contrasenia;
            cliente.mantenerSesion = credentials.sesionAbierta;
            //Grabando en el localStore
            let clienteStr = JSON.stringify(cliente);
            localStorage.setItem(CLIENTE_LOCAL_STORE_ID, clienteStr);
            //Pasando datos cliente al AdministradorPedido para su uso en el resto de la aplicación
            this.puntoVenta.cliente = cliente;
            console.log('Cliente:', this.puntoVenta.cliente);
            console.log('Saltando a seleccionar la region');
            this.navCtrl.navigateRoot(PAGINA_SELECCION_REGION);
          },
          error: (error) => {
            console.error('Error al iniciar sesión', error);
            if (error.status === 401 || error.status === 400) {
              this.errorMessage =
                'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
              this.mensajeErrorLogin();
            } else {
              this.errorMessage =
                'Error en el servidor. Inténtalo nuevamente más tarde.';
              this.mensajeErrorConexion();
            }
          },
        });
    }
  }

  navegaRegistro() {
    console.log('Navega a registro de usuario');
    this.navCtrl.navigateForward('/registro-cliente-correo');
  }

  navegaRecuperaContrasenia() {
    console.log('Navega a recuperación de contraseña');
    this.navCtrl.navigateForward('/login-recupera');
  }

  async mensajeErrorLogin() {
    const alert = await this.alertController.create({
      header: 'Datos incorrectos',
      message: 'El correo o la contrase\u00f1a son incorrectos',
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
            this.onLogin();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
