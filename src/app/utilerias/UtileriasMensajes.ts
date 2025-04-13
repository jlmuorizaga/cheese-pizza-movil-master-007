import {
  ESTATUS_PEDIDO_ATENDIDO,
  ESTATUS_PEDIDO_ATENDIDO_MENSAJE,
  ESTATUS_PEDIDO_CAPTURADO,
  ESTATUS_PEDIDO_CAPTURADO_MENSAJE,
  ESTATUS_PEDIDO_ENVIADO,
  ESTATUS_PEDIDO_ENVIADO_MENSAJE,
  ESTATUS_PEDIDO_LISTO,
  ESTATUS_PEDIDO_LISTO_MENSAJE,
  ESTATUS_PEDIDO_NUBE,
  ESTATUS_PEDIDO_NUBE_MENSAJE,
  ESTATUS_PEDIDO_PREVIOPAGO,
  ESTATUS_PEDIDO_PREVIOPAGO_MENSAJE,
  ESTATUS_PEDIDO_RECIBIDO,
  ESTATUS_PEDIDO_RECIBIDO_MENSAJE,
  TIPO_ENTREGA_DOMICILIO,
  TIPO_ENTREGA_DOMICILIO_TEXTO,
  TIPO_ENTREGA_SUCURSAL,
  TIPO_ENTREGA_SUCURSAL_TEXTO,
} from '../constantes/constantes';

export class UtileriasMensajes {
  public static tipoEntregaMensaje(tipoEntrega: string): string {
    let tipoStr = 'Error: Tipo de entrega no asignado';
    if (tipoEntrega) {
      switch (tipoEntrega) {
        case TIPO_ENTREGA_DOMICILIO:
          tipoStr = TIPO_ENTREGA_DOMICILIO_TEXTO;
          break;
        case TIPO_ENTREGA_SUCURSAL:
          tipoStr = TIPO_ENTREGA_SUCURSAL_TEXTO;
          break;
        default:
          tipoStr = 'Error: Tipo de entrega desconocido';
          break;
      }
    }
    return tipoStr;
  }

  public static estatusMensaje(estatus: string): string {
    let mensajeStr = 'Error: estatus no asignado';
    if (estatus) {
      switch (estatus) {
        case ESTATUS_PEDIDO_PREVIOPAGO:
          mensajeStr = ESTATUS_PEDIDO_PREVIOPAGO_MENSAJE;
          break;
        case ESTATUS_PEDIDO_NUBE:
          mensajeStr = ESTATUS_PEDIDO_NUBE_MENSAJE;
          break;
        case ESTATUS_PEDIDO_RECIBIDO:
          mensajeStr = ESTATUS_PEDIDO_RECIBIDO_MENSAJE;
          break;
        case ESTATUS_PEDIDO_CAPTURADO:
          mensajeStr = ESTATUS_PEDIDO_CAPTURADO_MENSAJE;
          break;
        case ESTATUS_PEDIDO_ENVIADO:
          mensajeStr = ESTATUS_PEDIDO_ENVIADO_MENSAJE;
          break;
        case ESTATUS_PEDIDO_LISTO:
          mensajeStr = ESTATUS_PEDIDO_LISTO_MENSAJE;
          break;
        case ESTATUS_PEDIDO_ATENDIDO:
          mensajeStr = ESTATUS_PEDIDO_ATENDIDO_MENSAJE;
          break;
        default:
          mensajeStr = 'Error: Tipo estatus desconocido';
          break;
      }
    }
    return mensajeStr;
  }

  public static valorEstatus(estatus: string): number {
    let valor = 0;
    if (estatus) {
      switch (estatus) {
        case ESTATUS_PEDIDO_PREVIOPAGO:
          valor = 0;
          break;
        case ESTATUS_PEDIDO_NUBE:
          valor = 0.2;
          break;
        case ESTATUS_PEDIDO_RECIBIDO:
          valor = 0.4;
          break;
        case ESTATUS_PEDIDO_CAPTURADO:
          valor = 0.6;
          break;
        case ESTATUS_PEDIDO_ENVIADO:
          valor = 0.8;
          break;
        case ESTATUS_PEDIDO_LISTO:
          valor = 0.8;
          break;
        case ESTATUS_PEDIDO_ATENDIDO:
          valor = 1;
          break;
        default:
          valor = 0;
          break;
      }
    }
    return valor;
  }
}
