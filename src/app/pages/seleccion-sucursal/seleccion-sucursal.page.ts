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
import { CatalogosService } from 'src/app/services/catalogos.service';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { NavController } from '@ionic/angular';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';
import { Sucursal } from 'src/app/model/Sucursal';

@Component({
  selector: 'app-seleccion-sucursal',
  templateUrl: './seleccion-sucursal.page.html',
  styleUrls: ['./seleccion-sucursal.page.scss'],
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
  ],
})
export class SeleccionSucursalPage implements OnInit {
  puntoVenta: PuntoVenta;
  constructor(
    private catalogosSrv: CatalogosService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Obteniendo la lista de sucursales');
    this.leerListaSucursales();
  }

  seleccionaSucursal(sucursal: Sucursal) {
    console.log('Sucursal seleccionada', sucursal);
    //Asignando la sucursal seleccionada al punto de venta
    this.puntoVenta.sucursalSeleccionada = sucursal;
    //Creando un pedido para la sucursal seleccionada
    this.puntoVenta.sucursalSeleccionada.creaPedido(
      this.puntoVenta.tipoEntrega
    );
    console.log('Navegando a menú principal');
    this.navCtrl.navigateForward('/menu-principal');
  }

  private leerListaSucursales() {
    this.catalogosSrv.obtenerSucursales().subscribe({
      next: (respuesta) => {
        //console.log(respuesta);
        this.puntoVenta.sucursales =
          this.puntoVenta.filtraSucursalesPorDistancia(respuesta);
        //console.log(this.puntoVenta.sucursales);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
