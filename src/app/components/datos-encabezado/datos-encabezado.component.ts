import { Component, OnInit } from '@angular/core';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { IonLabel, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import {
  PAGINA_LOGIN,
  TIPO_ENTREGA_DOMICILIO,
  TIPO_ENTREGA_SUCURSAL,
} from 'src/app/constantes/constantes';

@Component({
  selector: 'app-datos-encabezado',
  templateUrl: './datos-encabezado.component.html',
  standalone: true,
  styleUrls: ['./datos-encabezado.component.scss'],
  imports: [IonCardContent, IonCard, IonLabel],
})
export class DatosEncabezadoComponent implements OnInit {
  puntoVenta: PuntoVenta;
  entregaSucursal!: boolean;
  entregaDomicilio!: boolean;

  constructor(private navCtrl: NavController) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Componente datos encabezado');
    //Controlando el acceso
    if (!this.puntoVenta.cliente) {
      //Saltando a página de login
      this.navCtrl.navigateRoot(PAGINA_LOGIN);
      return;
    }

    //Identificando el tipo de entrega
    this.entregaSucursal = false;
    this.entregaDomicilio = false;
    if (this.puntoVenta.tipoEntrega) {
      if (this.puntoVenta.tipoEntrega === TIPO_ENTREGA_DOMICILIO) {
        this.entregaDomicilio = true;
      }
      if (this.puntoVenta.tipoEntrega === TIPO_ENTREGA_SUCURSAL) {
        this.entregaSucursal = true;
      }
    }
  }
}
