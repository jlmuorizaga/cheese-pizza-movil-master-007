import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonButton,
} from '@ionic/angular/standalone';
import { VERSION_APP } from 'src/app/constantes/constantes';
import { PuntoVenta } from 'src/app/model/PuntoVenta';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonMenu],
  standalone: true,
})
export class MenuLateralComponent implements OnInit {
  puntoVenta: PuntoVenta;
  versionApp = VERSION_APP;

  constructor(private navCtrl: NavController) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Menú lateral de la aplicación');
  }

  cambiarRegion() {
    console.log('Menú lateral cambiar región');
    //Salta a página de selección manual de la región
    this.navCtrl.navigateForward('/seleccion-region-manual');
  }

  editarDatos() {
    console.log('Menú lateral editar datos');
    //Salta a página de edición de datos del cliente
    this.navCtrl.navigateForward('/edita-datos-cliente');
  }

  cerrarSesion() {
    console.log('Menú lateral cerrar sesión');
    //Elimina los valores de las variables en el punto de venta
    this.puntoVenta.cerrarSesion();
    //Elimina la información guardada en el local storage
    localStorage.clear();
    //Salta a página del login
    this.navCtrl.navigateRoot('/login');
  }
}
