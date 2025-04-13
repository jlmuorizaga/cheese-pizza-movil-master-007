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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { NavController } from '@ionic/angular';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { Region } from 'src/app/model/Region';

@Component({
  selector: 'app-seleccion-region-manual',
  templateUrl: './seleccion-region-manual.page.html',
  styleUrls: ['./seleccion-region-manual.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
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
  ],
})
export class SeleccionRegionManualPage implements OnInit {
  puntoVenta: PuntoVenta;

  regiones!: Region[];

  constructor(
    private catalogosSrv: CatalogosService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Selección manual de la región');
    this.leerListaRegiones();
  }

  private leerListaRegiones() {
    this.catalogosSrv.obtenerRegiones().subscribe({
      next: (respuesta) => {
        //console.log(respuesta);
        this.regiones = respuesta;
        console.log(this.regiones);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  seleccionaRegion(region: Region) {
    console.log('Region seleccionada:', region);
    //Asignando la region seleccionada al punto de venta
    this.puntoVenta.regionActual = region;
    console.log('Navegando a selección de tipo de entrega');
    this.navCtrl.navigateRoot('/seleccion-tipo-entrega');
  }
}
