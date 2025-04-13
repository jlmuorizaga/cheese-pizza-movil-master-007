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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import {
  TIPO_ENTREGA_DOMICILIO,
  TIPO_ENTREGA_SUCURSAL,
} from 'src/app/constantes/constantes';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';
import { PedidoProceso } from 'src/app/model/PedidoProceso';
import { PedidosEnProcesoComponent } from '../../components/pedidos-en-proceso/pedidos-en-proceso.component';
import { MenuLateralComponent } from '../../components/menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-seleccion-tipo-entrega',
  templateUrl: './seleccion-tipo-entrega.page.html',
  styleUrls: ['./seleccion-tipo-entrega.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    DatosEncabezadoComponent,
    PedidosEnProcesoComponent,
    MenuLateralComponent,
    IonMenuButton,
  ],
})
export class SeleccionTipoEntregaPage implements OnInit {
  puntoVenta: PuntoVenta;
  pedidosProceso!: PedidoProceso[];

  constructor(private navCtrl: NavController) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('On Init de selección tipo de entrega');
    //Limpia datos de tipo de entrega
    this.puntoVenta.limpiaTipoEntrega();
  }

  pasaAEntregaADomicilio() {
    this.puntoVenta.tipoEntrega = TIPO_ENTREGA_DOMICILIO;
    console.log('Pasa a entrega a domicilio');
    this.navCtrl.navigateForward('/seleccion-domicilio');
  }

  pasaAEntregaEnSucursal() {
    this.puntoVenta.tipoEntrega = TIPO_ENTREGA_SUCURSAL;
    console.log('Pasa a entrega en sucursal');
    this.navCtrl.navigateForward('/seleccion-sucursal');
  }
}
