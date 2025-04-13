import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Utilerias } from '../utilerias/Utilerias';
import { NavController, AlertController } from '@ionic/angular';
import {
  CLIENTE_LOCAL_STORE_ID,
  PAGINA_LOGIN,
  PAGINA_SELECCION_REGION,
  VERSION_APP,
} from '../constantes/constantes';
import { Cliente } from '../model/cliente';
import { ClienteService } from '../services/cliente.service';
import { PuntoVenta } from '../model/PuntoVenta';
import { Credenciales } from '../model/Credenciales';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  versionApp = VERSION_APP;

  identificador: string;
  puntoVenta: PuntoVenta;

  constructor(
    private navCtrl: NavController,
    private clienteSvc: ClienteService,
    public alertController: AlertController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
    this.identificador = Utilerias.generaID();
  }

  ngOnInit() {
    this.verificaCliente();
  }

  verificaCliente() {
    console.log('Inicio');
    //Verificando cliente en el local store
    console.log('Recuperando al cliente del localStorage');
    const clienteGuardado = localStorage.getItem(CLIENTE_LOCAL_STORE_ID);
    //console.log('Cliente guardado:', clienteGuardado);
    if (clienteGuardado) {
      //Sí hay un cliente guardado
      console.log('Sí hay un cliente en el localStorage');
      const cliente: Cliente = JSON.parse(clienteGuardado);
      console.log('Cliente: ' + cliente.nombre);
      if (cliente.mantenerSesion) {
        //Se intentará realizar el login
        this.realizaLogin(cliente);
      } else {
        //No está marcado mantener sesión, se va al login
        console.log('No está marcado mantener sesión');
        console.log('Navegando a la página de login');
        this.navCtrl.navigateRoot(PAGINA_LOGIN);
      }
    } else {
      //No hay ningún cliente guardado, se va al login
      console.log('No hay un cliente en el localStorage');
      console.log('Navegando a la página de login');
      this.navCtrl.navigateRoot(PAGINA_LOGIN);
    }
  }

  realizaLogin(cliente: Cliente) {
    console.log('Tratando de inciar sesión automática en el home');
    let credenciales = new Credenciales();
    credenciales.correo = cliente.correoElectronico;
    credenciales.contrasenia = cliente.contrasenia;
    console.log('Credenciales:', credenciales);
    this.clienteSvc.verificaAccesoCliente(credenciales).subscribe({
      next: (response: any) => {
        console.log('Inicio de sesión exitoso', response);
        //Pasando datos cliente al AdministradorPedido para su uso en el resto de la aplicación
        this.puntoVenta.cliente = cliente;
        console.log('Cliente:', this.puntoVenta.cliente);
        console.log('Saltando a seleccionar la region');
        this.navCtrl.navigateRoot(PAGINA_SELECCION_REGION);
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        if (error.status === 401 || error.status === 400) {
          //Login incorrecto
          console.log('Login incorrecto');
          console.log('Navegando a la página de login');
          this.navCtrl.navigateRoot(PAGINA_LOGIN);
        } else {
          this.mensajeErrorConexion();
        }
      },
    });
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
            this.verificaCliente();
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }
}
