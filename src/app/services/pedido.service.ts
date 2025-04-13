import { ESTATUS_PEDIDO_NUBE } from './../constantes/constantes';
import { Injectable } from '@angular/core';
import { PedidoNube } from '../model/PedidoNube';
import { URL_API_PEDIDO } from '../constantes/constantes';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PedidoProceso } from '../model/PedidoProceso';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  constructor(private http: HttpClient) {}

  insertaPedidoNube(pedidoNube: PedidoNube) {
    const apiURL = URL_API_PEDIDO + '/pedidos';
    return this.http.post(apiURL, pedidoNube);
  }

  obtieneNuevoNumeroPedido() {
    const apiURL = URL_API_PEDIDO + '/pedidos/siguienteNumero';
    return this.http.get(apiURL);
  }

  actualizaEstatusPedidoNubePagado(
    numeroPedido: number,
    idPedido: string,
    urlReciboPago: string
  ) {
    const apiURL = URL_API_PEDIDO + '/pedidos/pago/' + idPedido;
    let actualiza = {
      numeroPedido: numeroPedido,
      estatus: ESTATUS_PEDIDO_NUBE,
      urlReciboPago: urlReciboPago,
    };
    return this.http.put(apiURL, actualiza);
  }

  obtenerPedidosEnProceso(idCliente: string): Observable<PedidoProceso[]> {
    const apiURL = URL_API_PEDIDO + '/pedidos/cliente/' + idCliente;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new PedidoProceso(
                item.idPedido,
                item.numeroPedido,
                item.claveSucursal,
                item.datosSucursal,
                item.datosDomicilioCliente,
                item.fechaHora,
                item.estatus,
                item.modalidadEntrega,
                item.montoTotal,
                item.cantidadProductos,
                item.resumenPedido,
                item.urlReciboPago,
                '',
                ''
              )
          )
        )
      );
  }

  obtenerDatosPedido(idPedido: string): Observable<PedidoProceso> {
    const apiURL = URL_API_PEDIDO + '/pedidos/' + idPedido;
    return this.http
      .get<any>(apiURL)
      .pipe(
        map(
          (data) =>
            new PedidoProceso(
              data.idPedido,
              data.numeroPedido,
              data.claveSucursal,
              data.datosSucursal,
              data.datosDomicilioCliente,
              data.fechaHora,
              data.estatus,
              data.modalidadEntrega,
              data.montoTotal,
              data.cantidadProductos,
              data.resumenPedido,
              data.urlReciboPago,
              data.detallePedido,
              data.instruccionesEspeciales
            )
        )
      );
  }
}
