import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonChip,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/model/Especialidad';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { ToastController, AlertController } from '@ionic/angular';
import { Pizza } from 'src/app/model/Pizza';
import { MUESTRA_CODIGO_CATEGORIAS } from 'src/app/constantes/constantes';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-pizzas-seleccion',
  templateUrl: './menu-pizzas-seleccion.page.html',
  styleUrls: ['./menu-pizzas-seleccion.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonLabel,
    IonChip,
    IonItem,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonBackButton,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BotonMenuComponent,
    BotonPedidoComponent,
    IonSelect,
    IonSelectOption,
    DatosEncabezadoComponent,
  ],
})
export class MenuPizzasSeleccionPage implements OnInit {
  muestraCategorias: boolean = MUESTRA_CODIGO_CATEGORIAS;
  puntoVenta: PuntoVenta;
  especialidad!: Especialidad;

  customActionSheetOptionsIngredientes = {
    header: 'Ingredientes',
    subHeader: 'Selecciona tu ingrediente favorito',
  };

  constructor(
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Menú selección pizzas');
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state && 'item' in navigation.extras.state) {
      this.especialidad = navigation.extras.state['item'];
    } else {
      console.warn('No se encontraron datos en el estado de navegación');
    }
    console.log('Especialidad:', this.especialidad);
  }

  agregaPizzaAPedido(pizza: Pizza) {
    console.log('Agrega pizza al pedido...');

    //Verificando primero si la pizza es válida
    let val = pizza.esValida();
    console.log('validación:', val);
    if (val.valido) {
      //Sí es válida, por lo que se procede a agregar la pizza en el pedido
      this.puntoVenta.sucursalSeleccionada.pedido.agregaPizza(pizza);
      //Se notifica con un toast que se agregó una pizza
      let mensaje = pizza.descripcionStr;
      this.presentToast(mensaje);
    } else {
      this.presentAlertValidation(val.mensaje);
      //No es válida, se notifica al usuario
    }
  }

  async presentAlertValidation(mensaje: string) {
    console.log('mensaje:', mensaje);
    const alert = await this.alertController.create({
      header: 'No se agreg\u00f3',
      message: mensaje,
      buttons: ['Cerrar'],
    });

    await alert.present();
  }

  async presentToast(mensaje: string) {
    console.log('Se creará y presentará el toast');
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'top',
      positionAnchor: 'header',
      color: 'dark',
      header: 'Se agreg\u00f3 al pedido:',
    });

    await toast.present();
  }
}
