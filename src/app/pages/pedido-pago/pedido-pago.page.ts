import { PuntoVenta } from './../../model/PuntoVenta';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonCard,
  IonLabel,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

import { PaymentFormComponent } from '../../components/payment-form/payment-form.component';
import { Pedido } from 'src/app/model/Pedido';
import { AlertController, NavController } from '@ionic/angular';
import { ConversorPedido } from 'src/app/model/ConversorPedido';
import {
  MONTO_MINIMO_COMPRA,
  PAGINA_LOGIN,
} from 'src/app/constantes/constantes';

@Component({
  selector: 'app-pedido-pago',
  templateUrl: './pedido-pago.page.html',
  styleUrls: ['./pedido-pago.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonLabel,
    IonCard,
    IonSpinner,
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
    PaymentFormComponent,
  ],
})
export class PedidoPagoPage implements OnInit {
  puntoVenta: PuntoVenta;
  claveSucursal!: string;
  monto!: number;

  cumpleMontoMinimo: boolean = false;

  nombreSucursal!: string;
  modalidadEntrega!: string;
  textoDomicilio!: string;
  nombreCliente!: string;
  pedido!: Pedido;
  resumenPedido!: string;
  //pedidoNube!: PedidoNube;

  // LGDD ini
  showSpinner!: boolean;
  verificandoConexion!: boolean;
  // LGDD fin

  constructor(
    public alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    //Controlando el acceso
    if (!this.puntoVenta.cliente) {
      //Saltando a página de login
      this.navCtrl.navigateRoot(PAGINA_LOGIN);
      return;
    }

    this.pedido = this.puntoVenta.sucursalSeleccionada.pedido;

    this.cumpleMontoMinimo = this.pedido.totalPedido >= MONTO_MINIMO_COMPRA;

    this.datosParaPago();
    //this.generaPedidoNube();

    //console.log('Promociones aplicadas: ', this.pedido.promociones.promocionesAplicadas);

    //Datos generales
    this.textoDomicilio = this.puntoVenta.domicilioEntrega;
    this.nombreSucursal = this.puntoVenta.sucursalSeleccionada.nombre;
    this.modalidadEntrega = this.puntoVenta.tipoEntregaStr;
    this.nombreCliente = this.puntoVenta.cliente.nombre;
    let pedidoNube = ConversorPedido.generaPedidoNube(this.puntoVenta);
    this.resumenPedido = pedidoNube.resumenPedido;
  }

  datosParaPago() {
    this.claveSucursal = this.puntoVenta.sucursalSeleccionada.clave;
    this.monto = this.puntoVenta.sucursalSeleccionada.pedido.totalPedido;
  }

  regresaMenu() {
    this.navCtrl.navigateRoot('/menu-principal');
  }
}
