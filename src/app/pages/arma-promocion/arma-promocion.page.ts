import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton,
  IonButton,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { Promocion } from 'src/app/model/Promocion';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Pizza } from 'src/app/model/Pizza';
import { Producto } from 'src/app/model/Producto';
import { Validacion } from 'src/app/model/Validacion';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-arma-promocion',
  templateUrl: './arma-promocion.page.html',
  styleUrls: ['./arma-promocion.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonSelect,
    IonSelectOption,
    IonRadioGroup,
    IonRadio,
    IonButton,
    IonBackButton,
    IonButtons,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
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
export class ArmaPromocionPage implements OnInit {
  puntoVenta: PuntoVenta;
  promocion!: Promocion;

  seleccion!: string;

  customActionSheetOptionsSalsas = {
    header: 'Salsas',
    subHeader: 'Selecciona tu salsa favorita',
  };

  customActionSheetOptionsIngredientes = {
    header: 'Ingredientes',
    subHeader: 'Selecciona tu ingrediente favorito',
  };

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Página de armado de promoción');
    this.route.queryParams.subscribe((params) => {
      let idPromocion = params['idPromocion'];
      console.log('idPromocion:', idPromocion);
      this.promocion =
        this.puntoVenta.sucursalSeleccionada.menu.damePromocion(idPromocion);
      console.log('Promoción:', this.promocion);
      //console.log('*************************************');
      //console.log('Menú:', this.puntoVenta.sucursalSeleccionada.menu);
      //console.log('*************************************');
    });
  }

  agregaPromocionAPedido() {
    //Validando que todas las categorías tengan algo seleccionado
    let valido = true;
    let mensajeError = '';
    for (let cat of this.promocion.categoriasParaSeleccion) {
      if (!cat.productoGeneralSeleccionado) {
        valido = false;
        mensajeError = 'Falta seleccionar ' + cat.nombre;
        console.log('Falta seleccionar', cat.nombre);
      } else {
        let pgs = cat.productoGeneralSeleccionado;
        let validacion: Validacion = null as any;
        if (pgs instanceof Pizza) {
          validacion = (pgs as Pizza).esValida();
        } else if (pgs instanceof Producto) {
          validacion = (pgs as Producto).esValido();
        }
        if (validacion && !validacion.valido) {
          valido = validacion.valido;
          mensajeError = validacion.mensaje;
        }
      }
    }

    if (valido) {
      console.log('Agregando promoción al pedido');
      //Agregando promoción al pedido
      this.puntoVenta.sucursalSeleccionada.pedido.agregaPromocion(
        this.promocion
      );
      this.presentToast('Promoci\u00f3n ' + this.promocion.nombre);
    } else {
      this.presentAlertValidation(mensajeError);
      console.log(
        'No se puede agregar la promoci\u00f3n, faltan elementos de seleccionar'
      );
    }
  }

  async presentAlertValidation(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'No se agreg\u00f3',
      message: mensaje,
      buttons: ['Cerrar'],
    });

    await alert.present();
  }

  async presentToast(mensaje: string) {
    console.log('Se creará y presentará el toast');
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'top',
      positionAnchor: 'header',
      color: 'dark',
      header: 'Se agreg\u00f3 al pedido:',
    });

    await toast.present();
  }
}
