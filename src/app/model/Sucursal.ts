import { Utilerias } from '../utilerias/Utilerias';
import { Menu } from './Menu';
import { Pedido } from './Pedido';

export class Sucursal {
  clave: string;
  nombre: string;
  domicilio: string;
  latitud: number;
  longitud: number;
  distanciaAproximada!: number;
  horaInicio: string;
  horaFin: string;
  stripePublicKey: string;
  idRegion: string;
  menu!: Menu;
  private _pleca!: string;

  constructor(
    clave: string,
    nombre: string,
    domicilio: string,
    horaInicio: string,
    horaFin: string,
    latitud: number,
    longitud: number,
    idRegion: string,
    stripePublicKey: string
  ) {
    this.clave = clave;
    this.nombre = nombre;
    this.domicilio = domicilio;
    this.latitud = latitud;
    this.longitud = longitud;
    this.horaInicio = horaInicio;
    this.horaFin = horaFin;
    this.stripePublicKey = stripePublicKey;
    this.idRegion = idRegion;
  }

  private _pedido!: Pedido;
  public get pedido(): Pedido {
    return this._pedido;
  }
  public creaPedido(tipoEntrega: string) {
    this._pedido = new Pedido();
    this._pedido.id = Utilerias.generaID();
    this._pedido.tipoEntrega = tipoEntrega;
  }

  public get pleca(): string {
    if (!this._pleca) {
      let i: number = Utilerias.getRandomNumber1a5();
      this._pleca = 'assets/images/pleca-sucursales-' + i + '.jpg';
    }
    return this._pleca;
  }

  public get distanciaAproximadaStr(): string {
    return Utilerias.convierteNumeroAFormatoLocal(this.distanciaAproximada, 1);
  }
}
