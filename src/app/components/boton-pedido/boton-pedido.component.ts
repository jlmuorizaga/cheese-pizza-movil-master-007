import { Component, OnInit } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { PuntoVenta } from 'src/app/model/PuntoVenta';

@Component({
  selector: 'app-boton-pedido',
  templateUrl: './boton-pedido.component.html',
  styleUrls: ['./boton-pedido.component.css'],
  standalone: true,
  imports: [IonButton],
})
export class BotonPedidoComponent implements OnInit {
  puntoVenta: PuntoVenta;

  constructor(private navCtrl: NavController) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Componente botón pedido');
  }

  abrePedido() {
    console.log('Abriendo el pedido...');
    this.navCtrl.navigateForward('/pedido');
  }
}
