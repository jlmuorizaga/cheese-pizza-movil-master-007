import { PuntoVenta } from './../../model/PuntoVenta';
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
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Sucursal } from 'src/app/model/Sucursal';
import { TransformadorApiAClase } from 'src/app/utilerias/TransformadorApiAClase';
import { SeccionPromociones } from 'src/app/model/SeccionPromociones';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { NavController } from '@ionic/angular';
import { Promocion } from 'src/app/model/Promocion';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-promociones',
  templateUrl: './menu-promociones.page.html',
  styleUrls: ['./menu-promociones.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardSubtitle,
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
export class MenuPromocionesPage implements OnInit {
  puntoVenta: PuntoVenta;
  constructor(
    private catalogosSrv: CatalogosService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Entrando a menú de promociones');
    this.leerListaPromociones(this.puntoVenta.sucursalSeleccionada);
  }

  private leerListaPromociones(sucursal: Sucursal) {
    this.catalogosSrv.obtenerPromocionesAPI(sucursal.clave).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.pasaListaPromociones(respuesta);
        console.log(
          this.puntoVenta.sucursalSeleccionada.menu.seccionPromociones
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private pasaListaPromociones(respuesta: any) {
    let seccion = this.puntoVenta.sucursalSeleccionada.menu
      .seccionPromociones as SeccionPromociones;
    seccion.promociones = TransformadorApiAClase.listaPromociones(
      respuesta,
      this.puntoVenta.sucursalSeleccionada.menu
    );
  }

  agregaPromoAPedido(promocion: Promocion) {
    console.log('Agrega promoción a pedido');
    //Salta a página de armado de la promoción
    this.navCtrl.navigateForward(['/arma-promocion'], {
      queryParams: {
        idPromocion: promocion.id,
      },
    });
  }
}
