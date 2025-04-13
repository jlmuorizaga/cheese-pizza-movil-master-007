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
} from '@ionic/angular/standalone';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { SeccionProductos } from 'src/app/model/SeccionProductos';
import { Sucursal } from 'src/app/model/Sucursal';
import { TipoProducto } from 'src/app/model/TipoProducto';
import { NavController } from '@ionic/angular';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-productos-tipos',
  templateUrl: './menu-productos-tipos.page.html',
  styleUrls: ['./menu-productos-tipos.page.scss'],
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
    BotonPedidoComponent,
    BotonMenuComponent,
    DatosEncabezadoComponent,
  ],
})
export class MenuProductosTiposPage implements OnInit {
  puntoVenta: PuntoVenta;

  constructor(
    private catalogosSrv: CatalogosService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Entrando a menú de tipos de productos');
    this.leerListaTiposProducto(this.puntoVenta.sucursalSeleccionada);
  }

  abreMenuProducto(tipoProducto: TipoProducto) {
    console.log(
      'Abriendo el menú de',
      tipoProducto.nombre,
      ' id:',
      tipoProducto.id
    );
    this.navCtrl.navigateForward(['/menu-productos'], {
      queryParams: {
        idTipo: tipoProducto.id,
      },
    });
  }

  private leerListaTiposProducto(sucursal: Sucursal) {
    this.catalogosSrv.obtenerTiposProducto(sucursal.clave).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        let seccion = this.puntoVenta.sucursalSeleccionada.menu
          .seccionOtrosProductos as SeccionProductos;
        seccion.tiposProducto = respuesta;
        console.log(
          this.puntoVenta.sucursalSeleccionada.menu.seccionOtrosProductos
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
