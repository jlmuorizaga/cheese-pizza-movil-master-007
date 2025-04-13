import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonItem,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonTextarea,
} from '@ionic/angular/standalone';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { Elemento } from 'src/app/model/Elemento';
import {
  addCircleOutline,
  removeCircleOutline,
  trashOutline,
  ribbonOutline,
  sparkles,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavController } from '@ionic/angular';
import { ElementoPromocion } from 'src/app/model/ElementoPromocion';
import { MUESTRA_CODIGO_CATEGORIAS } from 'src/app/constantes/constantes';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonButton,
    IonItem,
    IonLabel,
    IonCol,
    IonRow,
    IonGrid,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    BotonMenuComponent,
    DatosEncabezadoComponent,
    IonTextarea,
  ],
})
export class PedidoPage implements OnInit {
  muestraCategorias: boolean = MUESTRA_CODIGO_CATEGORIAS;
  puntoVenta: PuntoVenta;

  constructor(private navCtrl: NavController) {
    this.puntoVenta = PuntoVenta.getInstance();
    addIcons({
      removeCircleOutline,
      addCircleOutline,
      sparkles,
      trashOutline,
      ribbonOutline,
    });
  }

  ngOnInit() {
    console.log('Entrando a pedido');
    console.log('Pedido', this.puntoVenta.sucursalSeleccionada.pedido);
  }

  aumentar(elemento: Elemento) {
    if (elemento instanceof ElementoPromocion) {
      let promo = (elemento as ElementoPromocion).promocion;
      this.puntoVenta.sucursalSeleccionada.pedido.agregaPromocion(promo);
    } else {
      elemento.aumentar();
    }
    //Calcula 2x1 de pizzas
    this.calculaCasosEspecialesPedido();
  }

  disminuir(elemento: Elemento) {
    elemento.disminuir();
    //Calcula 2x1 de pizzas
    this.calculaCasosEspecialesPedido();
  }

  eliminar(elementoAEliminar: Elemento) {
    let listaElementos = this.puntoVenta.sucursalSeleccionada.pedido.elementos;
    let nuevaLista = listaElementos.filter(
      (objeto) => objeto !== elementoAEliminar
    );
    this.puntoVenta.sucursalSeleccionada.pedido.elementos = nuevaLista;
    //Calcula 2x1 de pizzas
    this.calculaCasosEspecialesPedido();
  }

  procederPago() {
    console.log('Se procederá con el pago');
    this.navCtrl.navigateForward('/pedido-pago');
  }

  private calculaCasosEspecialesPedido() {
    //Calculos de 2x1, bebidas gratis, validación de promociones, etc.
    this.puntoVenta.sucursalSeleccionada.pedido.calculaCasosEspecialesPedido();
  }
}
