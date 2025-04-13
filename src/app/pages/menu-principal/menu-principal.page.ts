import { PuntoVenta } from 'src/app/model/PuntoVenta';
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
  IonButtons,
  IonBackButton,
  IonToast,
} from '@ionic/angular/standalone';
import { Sucursal } from 'src/app/model/Sucursal';
import { Menu } from 'src/app/model/Menu';
import { Seccion } from 'src/app/model/Seccion';
import { SeccionPromociones } from 'src/app/model/SeccionPromociones';
import { SeccionProductos } from 'src/app/model/SeccionProductos';
import { NavController } from '@ionic/angular';
import { SeccionPizzas } from 'src/app/model/SeccionPizzas';
import { BotonPedidoComponent } from '../../components/boton-pedido/boton-pedido.component';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { cloneDeep } from 'lodash';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

@Component({
  selector: 'app-menu-principal',
  templateUrl: './menu-principal.page.html',
  styleUrls: ['./menu-principal.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonBackButton,
    IonButtons,
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
    DatosEncabezadoComponent,
  ],
})
export class MenuPrincipalPage implements OnInit {
  puntoVenta: PuntoVenta;

  constructor(
    private navCtrl: NavController,
    private catalogosSrv: CatalogosService
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Entrando a menú principal');
    console.log('Sucursal seleccionada:', this.puntoVenta.sucursalSeleccionada);
    console.log('Cargando menú...');
    this.cargaMenu(this.puntoVenta.sucursalSeleccionada);
    //Cargar el listado de categorias
    this.leerListaCategorias();
  }

  abreSeccionMenu(seccion: Seccion) {
    console.log('Abre sección', seccion.nombre);
    if (seccion instanceof SeccionPromociones) {
      this.navCtrl.navigateForward('/menu-promociones');
    } else if (seccion instanceof SeccionProductos) {
      this.navCtrl.navigateForward('/menu-productos-tipos');
    } else if (seccion instanceof SeccionPizzas) {
      this.navCtrl.navigateForward('/menu-pizzas');
    }
  }

  private cargaMenu(sucursal: Sucursal) {
    //Crea el objeto menú para esta sucursal
    sucursal.menu = new Menu();
    //Crea las tres secciones del menú: promociones, pizzas y otros productos
    //Sección promociones
    let seccionPromociones = new SeccionPromociones();
    seccionPromociones.nombre = 'Promociones especiales';
    seccionPromociones.descripcion =
      'Conoce las promociones que tenemos para ti';
    seccionPromociones.urlImg = 'assets/images/menu-promocion.jpg';
    //Sección pizzas
    let seccionPizzas = new SeccionPizzas();
    seccionPizzas.nombre = 'Pizzas de especialidad';
    seccionPizzas.descripcion =
      'Pide alguna de nuestras pizzas de especialidad, 2x1 todos los d\u00edas';
    seccionPizzas.urlImg = 'assets/images/menu-pizza.jpg';
    //Sección otros productos
    let seccionOtrosProductos = new SeccionProductos();
    seccionOtrosProductos.nombre = 'Otros productos';
    seccionOtrosProductos.descripcion =
      'Complementa tu pedido con bebidas, papas, alitas y mucho m\u00e1s';
    seccionOtrosProductos.urlImg = 'assets/images/menu-otros-productos.jpg';
    //Se integran las secciones al menú principal
    sucursal.menu.seccionPromociones = seccionPromociones;
    sucursal.menu.seccionPizzas = seccionPizzas;
    sucursal.menu.seccionOtrosProductos = seccionOtrosProductos;
    //Cargar las salsas
    this.leerListaSalsas(sucursal);
    //Cargar los ingredientes
    this.leerListaIngredientes();
    //Cargar las orillas
    this.leerListaOrillas(sucursal);
  }

  private leerListaCategorias() {
    this.catalogosSrv.obtenerCategorias().subscribe({
      next: (respuesta) => {
        console.log('Categorias:', respuesta);
        //Asignando productos y pizzas a cada categoría
        let claveSucursal = this.puntoVenta.sucursalSeleccionada.clave;
        //Asignando productos a categorías
        this.catalogosSrv.obtenerProductos(claveSucursal).subscribe({
          next: (resp) => {
            console.log('Productos:', resp);
            //Asignando productos a cada categoria
            for (let categoria of respuesta) {
              categoria.productosEnCategoria = [];
              for (let producto of resp) {
                if (producto.esDeCategoria(categoria.codigo)) {
                  //Copia producto para que cada categoría tenga sus propias instancias

                  let copia = cloneDeep(producto);

                  categoria.productosEnCategoria.push(producto);
                }
              }
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
        //Asignando pizzas a categorías
        this.catalogosSrv.obtenerPizzas(claveSucursal).subscribe({
          next: (resp) => {
            console.log('Pizzas:', resp);
            //Asignando pizzas a cada categoria
            for (let categoria of respuesta) {
              categoria.pizzasEnCategoria = [];
              for (let pizza of resp) {
                if (pizza.esDeCategoria(categoria.codigo)) {
                  //Copia pizza para que cada categoría tenga sus propias instancia

                  let copia = cloneDeep(pizza);

                  categoria.pizzasEnCategoria.push(copia);
                }
              }
            }
          },
          error: (error) => {
            console.error(error);
          },
        });

        //Cargando las categorías en el menú
        let menu = this.puntoVenta.sucursalSeleccionada.menu as Menu;
        menu.categorias = respuesta;
        console.log(
          'Categorias',
          this.puntoVenta.sucursalSeleccionada.menu.categorias
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private leerListaSalsas(sucursal: Sucursal) {
    this.catalogosSrv.obtenerSalsas(sucursal.clave).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        let seccion = this.puntoVenta.sucursalSeleccionada.menu
          .seccionOtrosProductos as SeccionProductos;
        seccion.salsas = respuesta;

        console.log(
          'Salsas',
          this.puntoVenta.sucursalSeleccionada.menu.seccionOtrosProductos.salsas
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private leerListaIngredientes() {
    this.catalogosSrv.obtenerIngredientes().subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        let seccion = this.puntoVenta.sucursalSeleccionada.menu
          .seccionPizzas as SeccionPizzas;
        seccion.ingredientes = respuesta;

        console.log(
          'Ingredientes',
          this.puntoVenta.sucursalSeleccionada.menu.seccionPizzas.ingredientes
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private leerListaOrillas(sucursal: Sucursal) {
    this.catalogosSrv.obtenerOrillas(sucursal.clave).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        let seccion = this.puntoVenta.sucursalSeleccionada.menu
          .seccionPizzas as SeccionPizzas;
        seccion.orillas = respuesta;

        console.log(
          'Orillas',
          this.puntoVenta.sucursalSeleccionada.menu.seccionPizzas.orillas
        );
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
