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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton, IonCardSubtitle } from '@ionic/angular/standalone';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';
import { DomicilioCliente } from 'src/app/model/domicilioCliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-seleccion-domicilio',
  templateUrl: './seleccion-domicilio.page.html',
  styleUrls: ['./seleccion-domicilio.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle,
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
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
    DatosEncabezadoComponent,
  ],
})
export class SeleccionDomicilioPage implements OnInit {
  puntoVenta: PuntoVenta;
  domicilios!: DomicilioCliente[];

  hayDomicilios: boolean = false;
  eliminaDomicilios: boolean = false;

  constructor(
    private clienteSrv: ClienteService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Entrando a selección del domicilio');
    this.eliminaDomicilios = false;
    //Carga domicilios del cliente
    this.leeDomicilios(this.puntoVenta.cliente.idCliente);
  }

  ionViewDidEnter() {
    //Carga domicilios del cliente
    this.eliminaDomicilios = false;
    this.leeDomicilios(this.puntoVenta.cliente.idCliente);
  }

  leeDomicilios(idCliente: string) {
    this.clienteSrv.leeDomiciliosCliente(idCliente).subscribe({
      next: (respuesta) => {
        this.domicilios = respuesta.filter(
          (domicilio) => (domicilio.idRegion = this.puntoVenta.regionActual.id)
        );

        this.hayDomicilios = this.domicilios.length > 0;
      },
      error: (error) => {
        console.log('Error al leer los domicilios del cliente');
      },
    });
  }

  seleccionaDomicilio(domicilio: DomicilioCliente) {
    this.puntoVenta.cliente.domicilioSeleccionado = domicilio;

    this.navCtrl.navigateForward('/seleccion-sucursal');
  }

  irAgregarDomicilio() {
    console.log('Ir a agregar un domicilio');
    this.navCtrl.navigateForward('/captura-domicilio');
  }

  eliminaDomicilio(domicilio: DomicilioCliente) {
    console.log('Se eliminará el domicilio:', domicilio.domicilio);
    this.clienteSrv.eliminaDomicilio(domicilio.idDomicilioCliente).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.leeDomicilios(this.puntoVenta.cliente.idCliente);
      },
      error: (error) => {
        console.log('Error al eliminar el domicilio', domicilio);
      },
    });
  }

  preparaEliminaDomicilios() {
    this.eliminaDomicilios = !this.eliminaDomicilios;
  }
}
