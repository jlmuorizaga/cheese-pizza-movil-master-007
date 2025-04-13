import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { URL_API_CATALOGOS } from '../constantes/constantes';
import { Region } from '../model/Region';
import { Sucursal } from '../model/Sucursal';
import { Categoria } from '../model/Categoria';
import { CategoriaMenu } from '../model/CategoriaMenu';
import { Ingrediente } from '../model/Ingrediente';
import { TipoProducto } from '../model/TipoProducto';
import { Producto } from '../model/Producto';
import { PromocionAPI } from '../model/PromocionAPI';
import { PizzaAPI } from '../model/PizzaAPI';
import { Pizza } from '../model/Pizza';
import { Salsa } from '../model/Salsa';
import { Orilla } from '../model/Orilla';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  constructor(private http: HttpClient) {}

  obtenerRegiones(): Observable<Region[]> {
    //return this.http.get(URL_API_CATALOGOS + '/regionesAll');
    const apiURL = URL_API_CATALOGOS + '/regionesAll';
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Region(item.id, item.nombre, item.latitud, item.longitud)
          )
        )
      );
  }

  obtenerSucursales(): Observable<Sucursal[]> {
    //return this.http.get(URL_API_CATALOGOS + '/sucursales');
    const apiURL = URL_API_CATALOGOS + '/sucursales';
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Sucursal(
                item.clave,
                item.nombreSucursal,
                item.domicilio,
                item.horaInicio,
                item.horaFin,
                item.latitud,
                item.longitud,
                item.idRegion,
                item.stripePublicKey
              )
          )
        )
      );
  }

  obtenerPromocionesAPI(claveSucursal: string): Observable<PromocionAPI[]> {
    //return this.http.get(URL_API_CATALOGOS + '/promociones/' + claveSucursal);

    const apiURL = URL_API_CATALOGOS + '/promociones/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new PromocionAPI(
                item.idPromocion,
                item.nombre,
                item.descripcion,
                item.precio,
                item.imgUrl,
                '',
                item.tipo,
                item.definicion
              )
          )
        )
      );
  }

  obtenerTiposProducto(claveSucursal: string): Observable<TipoProducto[]> {
    //return this.http.get(URL_API_CATALOGOS + '/tipoproductos/' + claveSucursal);
    const apiURL = URL_API_CATALOGOS + '/tipoproductos/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new TipoProducto(
                item.id,
                item.nombre,
                item.descripcion,
                item.imgUrl
              )
          )
        )
      );
  }

  obtenerProductosPorTipo(
    claveSucursal: string,
    idTipo: string
  ): Observable<Producto[]> {
    //return this.http.get(
    //  URL_API_CATALOGOS + '/productos/' + claveSucursal + '/' + idTipo
    //);
    const apiURL =
      URL_API_CATALOGOS + '/productos/' + claveSucursal + '/' + idTipo;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Producto(
                item.id,
                item.descripcion,
                item.tamanio,
                '',
                item.precio,
                item.usaSalsa === 'S',
                item.aplicaBebidaGratis === 'S',
                item.categoria1,
                item.categoria2,
                item.categoria3
              )
          )
        )
      );
  }

  obtenerProductos(claveSucursal: string): Observable<Producto[]> {
    //return this.http.get(
    //  URL_API_CATALOGOS + '/productos/' + claveSucursal
    //);
    const apiURL = URL_API_CATALOGOS + '/productos/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Producto(
                item.id,
                item.descripcion,
                item.tamanio,
                '',
                item.precio,
                item.usaSalsa === 'S',
                item.aplicaBebidaGratis === 'S',
                item.categoria1,
                item.categoria2,
                item.categoria3
              )
          )
        )
      );
  }

  obtenerPizzasAPI(claveSucursal: string): Observable<PizzaAPI[]> {
    //return this.http.get(URL_API_CATALOGOS + '/pizzas/' + claveSucursal);
    const apiURL = URL_API_CATALOGOS + '/pizzas/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new PizzaAPI(
                item.idPizza,
                item.idEspecialidad,
                item.nombreEspecialidad,
                item.idTamanioPizza,
                item.tamanioPizza,
                item.ordenTamanioPizza,
                item.ingredientes,
                item.imgUrl,
                item.precioX2,
                item.precioX1,
                item.cantidadIngredientes,
                item.esDeUnIngrediente === 'S',
                item.aplica2x1 === 'S',
                item.aplicaBebidaGratis === 'S',
                item.categoria1,
                item.categoria2,
                item.categoria3
              )
          )
        )
      );
  }

  obtenerPizzas(claveSucursal: string): Observable<Pizza[]> {
    //return this.http.get(URL_API_CATALOGOS + '/pizzas/' + claveSucursal);
    const apiURL = URL_API_CATALOGOS + '/pizzas/' + claveSucursal;
    return this.http.get<any[]>(apiURL).pipe(
      map((data: any[]) =>
        data.map(
          (item) =>
            new Pizza(
              item.idPizza,
              item.nombreEspecialidad,
              item.tamanioPizza,
              item.ordenTamanioPizza,
              item.imgUrl,
              item.categoria1,
              item.categoria2,
              item.categoria3,
              item.idEspecialidad,
              item.precioX2,
              item.precioX1,
              item.ingredientes,
              item.cantidadIngredientes,
              item.esDeUnIngrediente === 'S',
              item.aplica2x1 === 'S',
              true //Aplica bebida gratis
            )
        )
      )
    );
  }

  obtenerIngredientes(): Observable<Ingrediente[]> {
    //return this.http.get(URL_API_CATALOGOS + '/ingredientesAll');
    const apiURL = URL_API_CATALOGOS + '/ingredientesAll';
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map((item) => new Ingrediente(item.id, item.nombre))
        )
      );
  }

  obtenerSalsas(claveSucursal: string): Observable<Salsa[]> {
    const apiURL = URL_API_CATALOGOS + '/salsas/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map((item) => new Salsa(item.id, item.descripcion))
        )
      );
  }

  obtenerCategorias(): Observable<Categoria[]> {
    //return this.http.get(URL_API_CATALOGOS + '/categoriasAll');
    const apiURL = URL_API_CATALOGOS + '/categoriasAll';
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map((item) => new CategoriaMenu(item.codigo, item.nombre))
        )
      );
  }

  obtenerOrillas(claveSucursal: string): Observable<Orilla[]> {
    const apiURL = URL_API_CATALOGOS + '/orillas/' + claveSucursal;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new Orilla(item.id, item.descripcion, item.precio, item.idTamanio)
          )
        )
      );
  }
}
