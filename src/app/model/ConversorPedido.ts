import {
  ESTATUS_PEDIDO_NUBE,
  ESTATUS_PEDIDO_PREVIOPAGO,
  PAGO_EN_LINEA,
  SEPARADOR_DATOS,
  TIPO_ENTREGA_DOMICILIO,
} from '../constantes/constantes';
import { Utilerias } from '../utilerias/Utilerias';
import { ElementoPizza } from './ElementoPizza';
import { ElementoProducto } from './ElementoProducto';
import { ElementoPromocion } from './ElementoPromocion';
import { PedidoNube } from './PedidoNube';
import { Pizza } from './Pizza';
import { Producto } from './Producto';
import { PromoCombo } from './PromoCombo';
import { PromoPrecioEspecial } from './PromoPrecioEspecial';
import { PuntoVenta } from './PuntoVenta';

export class ConversorPedido {
  public static generaPedidoNube(puntoVenta: PuntoVenta): PedidoNube {
    //console.log('Genera pedido nube');
    let pedidoNube = new PedidoNube();
    //Leer el pedido del administrador de pedido
    const pedido = puntoVenta.sucursalSeleccionada.pedido;
    //console.log('********************');
    //console.log('* Datos del pedido *');
    //console.log('********************');
    //console.log('Pedido:', pedido);

    pedidoNube.idPedido = Utilerias.generaID();
    pedidoNube.idCliente = puntoVenta.cliente.idCliente;
    pedidoNube.datosCliente =
      puntoVenta.cliente.nombre + SEPARADOR_DATOS + puntoVenta.cliente.telefono;

    pedidoNube.montoTotal = pedido.totalPedido;

    //Asignando datos del domicilio sólo si es entrega a domicilio
    if (
      puntoVenta.sucursalSeleccionada.pedido.tipoEntrega ===
      TIPO_ENTREGA_DOMICILIO
    ) {
      pedidoNube.idDomicilioCliente =
        puntoVenta.cliente.domicilioSeleccionado.idDomicilioCliente;

      pedidoNube.datosDomicilioCliente =
        puntoVenta.cliente.domicilioSeleccionado.domicilioCompleto;
    }

    pedidoNube.claveSucursal = puntoVenta.sucursalSeleccionada.clave;
    pedidoNube.datosSucursal = puntoVenta.sucursalSeleccionada.nombre;
    pedidoNube.fechaHora = Utilerias.fechaActual();
    pedidoNube.estatus = ESTATUS_PEDIDO_PREVIOPAGO;
    pedidoNube.modalidadEntrega =
      puntoVenta.sucursalSeleccionada.pedido.tipoEntrega;

    let cantidadProductosGeneral = 0;
    let cantidadPromociones = 0;
    let cantidadPizzas = 0;
    let cantidadOtrosProductos = 0;
    //Asignando el detalle del pedido
    {
      let detalle = '';
      let separador = '';
      //Agregando elementos al pedido
      for (const elemento of pedido.elementos) {
        detalle +=
          separador +
          elemento.cantidad +
          ' ' +
          elemento.descripcion +
          ' ' +
          elemento.subTotalMXN;
        separador = SEPARADOR_DATOS;
        if (elemento instanceof ElementoPizza) {
          cantidadProductosGeneral += elemento.cantidad;
          cantidadPizzas += elemento.cantidad;
        }
        if (elemento instanceof ElementoProducto) {
          cantidadProductosGeneral += elemento.cantidad;
          cantidadOtrosProductos += elemento.cantidad;
        }

        //Si el elemento de un pedido es una promoción, agrega también las pizzas
        //  y productos que componen la promoción
        if (elemento instanceof ElementoPromocion) {
          cantidadPromociones += elemento.cantidad;

          let promo = (elemento as ElementoPromocion).promocion;
          //Si es una promoción de tipo combo, agrega todos los productos de sus
          //  categorías
          if (promo instanceof PromoCombo) {
            let pc = promo as PromoCombo;
            for (let c of pc.categorias) {
              detalle +=
                separador +
                '--- ' +
                c.productoGeneralSeleccionado.descripcionStr;
              if (c.productoGeneralSeleccionado instanceof Pizza) {
                cantidadProductosGeneral += elemento.cantidad;
                cantidadPizzas += elemento.cantidad;
              }
              if (c.productoGeneralSeleccionado instanceof Producto) {
                cantidadProductosGeneral += elemento.cantidad;
                cantidadOtrosProductos += elemento.cantidad;
              }
            }
          }
          //Si es una promoción de tipo precio especial, agrega todos los
          //  productos de sus categorías de precio especial
          if (promo instanceof PromoPrecioEspecial) {
            let pe = promo as PromoPrecioEspecial;
            for (let c of pe.categoriasPrecioEspecial) {
              detalle +=
                separador +
                '--- ' +
                c.productoGeneralSeleccionado.descripcionStr;
              if (c.productoGeneralSeleccionado instanceof Pizza) {
                cantidadProductosGeneral += elemento.cantidad;
                cantidadPizzas += elemento.cantidad;
              }
              if (c.productoGeneralSeleccionado instanceof Producto) {
                cantidadProductosGeneral += elemento.cantidad;
                cantidadOtrosProductos += elemento.cantidad;
              }
            }
          }
        }
      }
      pedidoNube.detallePedido = detalle;
    }

    pedidoNube.instruccionesEspeciales = pedido.instruccionesEspeciales;

    pedidoNube.tipoPago = PAGO_EN_LINEA;
    //pedidoNube.cantidadProductos = pedido.cantidad;
    //pedidoNube.resumenPedido = pedido.resumenPedido;
    pedidoNube.cantidadProductos = cantidadProductosGeneral;
    let resumen = '';
    let separador = '';
    if (cantidadPromociones > 0) {
      resumen += separador + 'Promociones: ' + cantidadPromociones;
      separador = ', ';
    }
    if (cantidadPizzas > 0) {
      resumen += separador + 'Pizzas: ' + cantidadPizzas;
      separador = ', ';
    }
    if (cantidadOtrosProductos > 0) {
      let denominacion = '';
      if (cantidadPizzas > 0) {
        denominacion = 'Otros productos';
      } else {
        denominacion = 'Productos';
      }

      resumen += separador + denominacion + ': ' + cantidadOtrosProductos;
      separador = ', ';
    }
    pedidoNube.resumenPedido = resumen;
    //console.log('Pedido Nube:', pedidoNube);
    //console.log('********************');

    pedidoNube.urlReciboPago = 'Pago pendiente';

    return pedidoNube;
  }
}
