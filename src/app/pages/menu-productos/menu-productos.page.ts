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
  IonButton,
  IonBackButton,
  IonButtons,
  IonChip,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Sucursal } from 'src/app/model/Sucursal';
import { Producto } from 'src/app/model/Producto';
import { TipoProducto } from 'src/app/model/TipoProducto';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';
import { Salsa } from 'src/app/model/Salsa';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MUESTRA_CODIGO_CATEGORIAS } from 'src/app/constantes/constantes';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-productos',
  templateUrl: './menu-productos.page.html',
  styleUrls: ['./menu-productos.page.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonChip,
    IonButtons,
    IonBackButton,
    IonButton,
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
    IonSelect,
    IonSelectOption,
  ],
})
export class MenuProductosPage implements OnInit {
  muestraCategorias: boolean = MUESTRA_CODIGO_CATEGORIAS;
  puntoVenta: PuntoVenta;
  productos!: Producto[];
  tipoProducto!: TipoProducto;
  salsas: Salsa[];

  customActionSheetOptionsSalsas = {
    header: 'Salsas',
    subHeader: 'Selecciona tu salsa favorita',
  };

  constructor(
    private route: ActivatedRoute,
    private catalogosSrv: CatalogosService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
    this.salsas =
      this.puntoVenta.sucursalSeleccionada.menu.seccionOtrosProductos.salsas;
  }

  ngOnInit() {
    console.log('Entrando a menú de tipos de productos');
    this.route.queryParams.subscribe((params) => {
      let idTipo = params['idTipo'];
      console.log(idTipo);
      this.tipoProducto =
        this.puntoVenta.sucursalSeleccionada.menu.dameTipoProducto(idTipo);
      //Cargar el listado de productos de este tipo
      this.leerListaProducto(this.puntoVenta.sucursalSeleccionada, idTipo);
    });
  }

  private leerListaProducto(sucursal: Sucursal, idTipo: string) {
    this.catalogosSrv
      .obtenerProductosPorTipo(sucursal.clave, idTipo)
      .subscribe({
        next: (respuesta) => {
          console.log(respuesta);
          this.productos = respuesta;
          console.log(this.productos);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  agregaAPedido(producto: Producto) {
    console.log('Agrega producto a pedido');
    //Verificando primero si el producto es válido
    let val = producto.esValido();
    if (val.valido) {
      //Si es válido, por lo que se procede a agregar el producto en el menú
      this.puntoVenta.sucursalSeleccionada.pedido.agregaProducto(producto);
      //Se notifica con un toast que se agregó un producto
      let mensaje = producto.descripcionStr;
      this.presentToast(mensaje);
    } else {
      this.presentAlertValidation(val.mensaje);
      //No es válido, se notifica al usuario
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
