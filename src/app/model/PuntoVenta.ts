import * as turf from '@turf/turf';
import {
  DISTANCIA_MAXIMA_ENTREGA_DOMICILIO,
  DISTANCIA_MAXIMA_ENTREGA_SUCURSAL,
  TIPO_ENTREGA_DOMICILIO,
  TIPO_ENTREGA_SUCURSAL,
} from '../constantes/constantes';
import { UtileriasMensajes } from '../utilerias/UtileriasMensajes';
import { Cliente } from './cliente';
import { ConversorPedido } from './ConversorPedido';
import { Region } from './Region';
import { Sucursal } from './Sucursal';

export class PuntoVenta {
  cerrarSesion() {
    this._cliente = null as any;
    this._sucursalSeleccionada = null as any;
    this._regionActual = null as any;
    this._latitud = null as any;
    this._longitud = null as any;
    this._sucursales = null as any;
    this.tipoEntrega = null as any;
  }

  codigoVerificacion = '01960749-a40e-7013-9d94-c4a2631fdf3b';

  private _tipoEntrega!: string;
  public get tipoEntrega(): string {
    return this._tipoEntrega;
  }
  public set tipoEntrega(value: string) {
    this._tipoEntrega = value;
  }

  private _cliente!: Cliente;
  public get cliente(): Cliente {
    return this._cliente;
  }
  public set cliente(value: Cliente) {
    this._cliente = value;
  }

  private _regionActual!: Region;
  public get regionActual(): Region {
    return this._regionActual;
  }
  public set regionActual(value: Region) {
    this._regionActual = value;
  }

  private _sucursalSeleccionada!: Sucursal;
  public get sucursalSeleccionada(): Sucursal {
    return this._sucursalSeleccionada;
  }
  public set sucursalSeleccionada(value: Sucursal) {
    this._sucursalSeleccionada = value;
  }

  private _sucursales!: Sucursal[];

  public get sucursales(): Sucursal[] {
    //Regresa solamente las sucursales de la región
    if (this._regionActual && this._sucursales) {
      //Regresa solamente las sucursales de la región actual
      return this._sucursales.filter(
        (sucursal) => sucursal.idRegion === this._regionActual.id
      );
    } else {
      //Si no hay una región actual, regresa todas las sucursales
      return this._sucursales;
    }
  }
  public set sucursales(value: Sucursal[]) {
    this._sucursales = value;
  }

  //Coordenadas del usuario
  private _latitud!: number;
  public get latitud(): number {
    return this._latitud;
  }
  public set latitud(value: number) {
    this._latitud = value;
  }
  private _longitud!: number;
  public get longitud(): number {
    return this._longitud;
  }
  public set longitud(value: number) {
    this._longitud = value;
  }
  private _exactitud!: number;
  public get exactitud(): number {
    return this._exactitud;
  }
  public set exactitud(value: number) {
    this._exactitud = value;
  }
  //Terminan datos de coordenadas del usuario

  public filtraSucursalesPorDistancia(sucursales: Sucursal[]): Sucursal[] {
    //Si la entrega es a domicilio y ya se tiene un domicilio seleccionado, entonces
    // la distancia se calculará entre las coordenadas del domicilio seleccionado y la
    // sucursal. Se ordenará la lista de sucursales por la distancia, de menor a mayor.

    //Si la entrega es en sucursal y se tienen las coordenadas de la ubicación del usuario,
    // entonces la distancia se calculará entre las coordenadas del usuario y la sucursal.
    // Se ordenará la lista de sucursales por la distancia, de menor a mayor.

    //Si la entrega es en sucursal y no se tienen las coordenadas de la ubicación del usuario,
    // entonces la distancia será cero y la lista de sucursales se ordenará por orden alfabético.

    //Realizar al cálculo de distancias de sucursales

    console.log('*************************');
    console.log('* Cálculo de distancias *');
    console.log('*************************');

    let latitud: number = null as any;
    let longitud: number = null as any;
    let calcularDistancia = true;

    if (
      this.tipoEntrega === TIPO_ENTREGA_DOMICILIO &&
      this.cliente.domicilioSeleccionado
    ) {
      let domicilio = this.cliente.domicilioSeleccionado;
      latitud = domicilio.latitud;
      longitud = domicilio.longitud;
    }

    if (this.tipoEntrega === TIPO_ENTREGA_SUCURSAL) {
      if (this.latitud && this.longitud) {
        latitud = this.latitud;
        longitud = this.longitud;
      } else {
        calcularDistancia = false;
      }
    }
    for (let sucursal of sucursales) {
      if (calcularDistancia) {
        const puntoUsuario = turf.point([longitud, latitud]);
        const puntoSucursal = turf.point([sucursal.longitud, sucursal.latitud]);
        const distancia = turf.distance(puntoUsuario, puntoSucursal);
        sucursal.distanciaAproximada = distancia;
      } else {
        sucursal.distanciaAproximada = 0;
      }
    }

    //Ordena sucursales
    sucursales.sort((a, b) => {
      // Primero se compara el atributo de distancia.
      if (a.distanciaAproximada === b.distanciaAproximada) {
        // Si son iguales, se utiliza localeCompare para ordenar el nombre.
        return a.nombre.localeCompare(b.nombre);
      }
      return a.distanciaAproximada - b.distanciaAproximada;
    });

    //Depura sucursales si están más alejadas que la distancia máxima de entrega en sucursal,
    //  deja sólo las sucursales cercanas
    if (this.tipoEntrega === TIPO_ENTREGA_SUCURSAL) {
      // Se crea una nueva lista filtrada con las sucursales cuya distancia es menor o igual a una distancia dada.
      const sucursalesFiltradas = sucursales.filter(
        (sucursal) =>
          sucursal.distanciaAproximada <= DISTANCIA_MAXIMA_ENTREGA_SUCURSAL
      );
      sucursales = sucursalesFiltradas;
    }

    //Depura sucursales si es entrega a domicilio, deja sólo las sucursales cercanas
    if (this.tipoEntrega === TIPO_ENTREGA_DOMICILIO) {
      // Se crea una nueva lista filtrada con las sucursales cuya distancia es menor o igual a una distancia dada.
      const sucursalesFiltradas = sucursales.filter(
        (sucursal) =>
          sucursal.distanciaAproximada <= DISTANCIA_MAXIMA_ENTREGA_DOMICILIO
      );
      sucursales = sucursalesFiltradas;
    }

    return sucursales;
  }

  public get tipoEntregaStr(): string {
    return UtileriasMensajes.tipoEntregaMensaje(this.tipoEntrega);
  }

  public get domicilioEntrega(): string {
    let d = 'Domicilio de entrega no definido';
    if (this.tipoEntrega === TIPO_ENTREGA_DOMICILIO) {
      if (this.cliente && this.cliente.domicilioSeleccionado) {
        d = this.cliente.domicilioSeleccionado.domicilioCompletoLineaContinua;
      }
    }
    if (this.tipoEntrega === TIPO_ENTREGA_SUCURSAL) {
      if (this.sucursalSeleccionada) {
        d = this.sucursalSeleccionada.domicilio;
      }
    }
    return d;
  }

  public reiniciaPedido() {
    //TODO Reiniciar el pedido
  }

  public limpiaTipoEntrega() {
    this.tipoEntrega = null as any;
    this.cliente.domicilioSeleccionado = null as any;
    this.sucursalSeleccionada = null as any;
  }

  public get cantidadProductos(): number {
    let cantidad = 0;
    let pedidoNube = ConversorPedido.generaPedidoNube(this);
    cantidad = pedidoNube.cantidadProductos;
    return cantidad;
  }

  /***********************************************
   * Se implementa el patrón de diseño Singleton *
   ***********************************************/
  private static instance: PuntoVenta; //Almacena la única instancia de la clase.

  //Evita que se pueda crear una nueva instancia de la clase utilizando new.
  private constructor() {
    console.log('Instancia de PuntoVenta creada');
  }

  //Verifica si ya existe una instancia, de no ser así, crea una y la almacena.
  //Si ya existe, devuelve la instancia existente.
  public static getInstance(): PuntoVenta {
    if (!PuntoVenta.instance) {
      PuntoVenta.instance = new PuntoVenta();
    }
    return PuntoVenta.instance;
  }
  /*********************************************************
   * Termina implementación del patrón de diseño Singleton *
   *********************************************************/
}
