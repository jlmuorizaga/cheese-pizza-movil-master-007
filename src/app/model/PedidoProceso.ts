import {
  SEPARADOR_DATOS,
  TIPO_ENTREGA_DOMICILIO,
} from '../constantes/constantes';
import { Utilerias } from '../utilerias/Utilerias';
import { UtileriasMensajes } from '../utilerias/UtileriasMensajes';
import { PedidoNube } from './PedidoNube';

export class PedidoProceso extends PedidoNube {
  datosDomicilioSucursal!: string;

  constructor(
    idPedido: string,
    numeroPedido: number,
    claveSucursal: string,
    datosSucursal: string,
    datosDomicilioCliente: string,
    fechaHora: string,
    estatus: string,
    modalidadEntrega: string,
    montoTotal: number,
    cantidadProductos: number,
    resumenPedido: string,
    urlReciboPago: string,
    detallePedido: string,
    instruccionesEspeciales: string
  ) {
    super();
    this.idPedido = idPedido;
    this.numeroPedido = numeroPedido;
    this.claveSucursal = claveSucursal;
    this.datosSucursal = datosSucursal;
    this.datosDomicilioCliente = datosDomicilioCliente;
    this.fechaHora = fechaHora;
    this.estatus = estatus;
    this.modalidadEntrega = modalidadEntrega;
    this.montoTotal = montoTotal;
    this.cantidadProductos = cantidadProductos;
    this.resumenPedido = resumenPedido;
    this.urlReciboPago = urlReciboPago;
    this.detallePedido = detallePedido;
    this.instruccionesEspeciales = instruccionesEspeciales;
  }

  public get fechaHoraStr(): string {
    let resultado = 'Fecha no especificada';
    if (this.fechaHora) {
      resultado = Utilerias.formatDateTimeWithMonthName(this.fechaHora);
    }
    return resultado;
  }

  public get montoTotalStr(): string {
    return Utilerias.convierteNumeroAMoneda(this.montoTotal);
  }

  public get modalidadEntregaStr(): string {
    return UtileriasMensajes.tipoEntregaMensaje(this.modalidadEntrega);
  }

  public get estatusStr(): string {
    return UtileriasMensajes.estatusMensaje(this.estatus);
  }

  public get valorEstatus(): number {
    return UtileriasMensajes.valorEstatus(this.estatus);
  }

  public get detallePedidoDesglosado(): string[] {
    return this.detallePedido.split(SEPARADOR_DATOS);
  }

  public get domicilioEntrega(): string {
    let dom = '';
    if (this.modalidadEntrega === TIPO_ENTREGA_DOMICILIO) {
      dom = this.datosDomicilioCliente;
    } else {
      dom = this.datosDomicilioSucursal;
    }
    return dom;
  }

  public get domicilioDesglosado(): string[] {
    if (this.domicilioEntrega) {
      return this.domicilioEntrega.split('|');
    } else {
      return [];
    }
  }
}
