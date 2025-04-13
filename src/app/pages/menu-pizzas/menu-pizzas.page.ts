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
  IonCardContent,
} from '@ionic/angular/standalone';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { NavController } from '@ionic/angular';
import { Sucursal } from 'src/app/model/Sucursal';
import { SeccionPizzas } from 'src/app/model/SeccionPizzas';
import { TransformadorApiAClase } from 'src/app/utilerias/TransformadorApiAClase';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { PizzaAPI } from 'src/app/model/PizzaAPI';
import { Especialidad } from 'src/app/model/Especialidad';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-pizzas',
  templateUrl: './menu-pizzas.page.html',
  styleUrls: ['./menu-pizzas.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
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
    BotonPedidoComponent,
    BotonMenuComponent,
    DatosEncabezadoComponent,
  ],
})
export class MenuPizzasPage implements OnInit {
  puntoVenta: PuntoVenta;

  constructor(
    private catalogosSrv: CatalogosService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Entrando al menú pizzas');
    //Cargar el listado de pizzas
    this.leerListaPizzas(this.puntoVenta.sucursalSeleccionada);
  }

  private leerListaPizzas(sucursal: Sucursal) {
    this.catalogosSrv.obtenerPizzasAPI(sucursal.clave).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.pasaListaPizzas(respuesta);
        console.log(
          'Sección pizzas',
          this.puntoVenta.sucursalSeleccionada.menu.seccionPizzas
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private pasaListaPizzas(respuesta: PizzaAPI[]) {
    let seccion = this.puntoVenta.sucursalSeleccionada.menu
      .seccionPizzas as SeccionPizzas;
    seccion.especialidades = TransformadorApiAClase.listaEspecialidades(
      respuesta,
      seccion.orillas
    );
  }

  abrePizzaSeleccion(especialidad: Especialidad) {
    console.log(
      'Se abrirá la página de selección de pizza de la especialidad',
      especialidad.nombre
    );
    this.navCtrl.navigateForward('/menu-pizzas-seleccion', {
      state: { item: especialidad },
    });
  }
}
