import { Utilerias } from '../utilerias/Utilerias';
import { Elemento } from './Elemento';
import { ElementoPizza } from './ElementoPizza';
import { ElementoProducto } from './ElementoProducto';
import { ElementoPromocion } from './ElementoPromocion';
import { Pizza } from './Pizza';
import { Producto } from './Producto';
import { Promocion } from './Promocion';
import { cloneDeep, isEqual } from 'lodash';
import { PromoPrecioEspecial } from './PromoPrecioEspecial';
import { Categoria } from './Categoria';
import { MONTO_MINIMO_COMPRA } from '../constantes/constantes';

export class Pedido {
  id!: string;
  tipoEntrega!: string;
  elementos!: Elemento[];
  mensajeBebidas!: string;

  instruccionesEspeciales!: string;

  private mensajeNohayNadaPedido =
    'No hay nada en tu pedido. Vuelve al men\u00fa y agrega algo.';
  private mensajeNoCubreMontoMinimo =
    'El total del pedido debe de ser al menos de ' +
    Utilerias.convierteNumeroAMoneda(MONTO_MINIMO_COMPRA) +
    '. Vuelve al men\u00fa y agrega algo.';
  private mensajePuedeProcederPago =
    'Ya puedes proceder al pago para enviar tu pedido';
  private mensajeFaltaCompletarPromos =
    'Se deben completar las promociones antes de pagar';

  pedidoNoValido: boolean = true;
  mensajePedidoNoValido: string = this.mensajeNohayNadaPedido;

  constructor() {
    this.elementos = [];
  }

  agregaProducto(producto: Producto) {
    //Se realiza una copia del producto para no meter la misma instancia que está en el menú
    //y así evitar que si cambias algo en el menú (por  ejemplo elegir otra salsa)
    //se altere el producto que ya está en el pedido

    let copia = cloneDeep(producto);
    //console.log('Producto para pedido', copia);

    //Se verifica si el producto ya está en la lista de elementos
    //Si ya está, se aumenta su cantidad
    //Si no está, se agrega a la lista del pedido
    let yaEsta = false;
    for (let e of this.elementos) {
      console.log('Verificando igualdad');
      console.log('Objeto 1', e);
      console.log('Objeto 2', copia);
      let p = (e as ElementoProducto).producto;
      if (isEqual(p, copia)) {
        yaEsta = true;
        e.aumentar();
        break;
      }
    }
    if (!yaEsta) {
      let elemento = new ElementoProducto();
      elemento.cantidad = 1;
      elemento.producto = copia;
      this.elementos.push(elemento);
    }
    this.calculaCasosEspecialesPedido();
  }

  agregaPizza(pizza: Pizza) {
    //Se realiza una copia de la pizza para no meter la misma instancia que está en el menú
    //y así evitar que si cambias algo en el menú (por  ejemplo elegir otro ingrediente)
    //se altere la pizza que ya está en el pedido

    let copia = cloneDeep(pizza);
    //console.log('Pizza para pedido', copia);

    //Se verifica si la pizza ya está en la lista de elementos
    //Si ya está, se aumenta su cantidad
    //Si no está, se agrega a la lista del pedido
    let yaEsta = false;
    for (let e of this.elementos) {
      console.log('Verificando igualdad');
      console.log('Objeto 1', e);
      console.log('Objeto 2', copia);
      let p = (e as ElementoPizza).pizza;
      if (isEqual(p, copia)) {
        yaEsta = true;
        e.aumentar();
        break;
      }
    }
    if (!yaEsta) {
      let elemento = new ElementoPizza();
      elemento.cantidad = 1;
      elemento.pizza = copia;
      this.elementos.push(elemento);
    }
    this.calculaCasosEspecialesPedido();
  }

  agregaPromocion(promocion: Promocion) {
    console.log('Agregando la promoción al pedido');
    //Realizando copia de la promoción antes de agregarla al pedido, para que en
    //el pedido se tenga una instancia diferente y no interfiera con otras
    //selecciones de promociones, pizzas o productos

    let copia = cloneDeep(promocion);

    //Se verifica si la promoción ya está en la lista de elementos
    //Si ya está, se aumenta su cantidad
    //Si no está, se agrega a la lista del pedido
    //Si la promoción es de precio especial, siempre se agrega otro elemento al pedido
    let yaEsta = false;
    if (!(promocion instanceof PromoPrecioEspecial)) {
      for (let e of this.elementos) {
        let p = (e as ElementoPromocion).promocion;
        //Limpia campos de control
        console.log('Verificando igualdad');
        console.log('Objeto 1', p);
        console.log('Objeto 2', copia);

        if (isEqual(p, copia)) {
          yaEsta = true;
          e.aumentar();
          break;
        }
      }
    }

    if (!yaEsta) {
      let elemento = new ElementoPromocion();
      elemento.cantidad = 1;
      elemento.promocion = copia;
      this.elementos.push(elemento);
    }

    this.calculaCasosEspecialesPedido();
  }

  public get totalPedido(): number {
    let total = 0;
    for (let e of this.elementos) {
      total += e.subtotal;
    }
    return total;
  }

  public get totalPedidoMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.totalPedido);
  }

  public calculaCasosEspecialesPedido() {
    //Ordena el pedido, hace cálculos de 2x1, bebidas gratis, valida las promociones, etc.
    //Se asume primero que todo está bien
    this.pedidoNoValido = false;
    this.mensajePedidoNoValido = this.mensajePuedeProcederPago;

    //Verifica que exista al menos un producto
    if (this.elementos.length === 0) {
      this.pedidoNoValido = true;
      this.mensajePedidoNoValido = this.mensajeNohayNadaPedido;
    }

    //Verifica que cubra el monto mínimo
    if (this.totalPedido < MONTO_MINIMO_COMPRA) {
      this.pedidoNoValido = true;
      this.mensajePedidoNoValido = this.mensajeNoCubreMontoMinimo;
    }

    //Ordena el pedido
    this.ordenarPedido();
    //Calcula 2x1
    this.calcula2x1();
    //Verifica promociones
    let todoBien = this.verificaValidezPromociones();
    if (!todoBien) {
      this.pedidoNoValido = true;
      this.mensajePedidoNoValido = this.mensajeFaltaCompletarPromos;
    }

    //Calcula bebidas gratis
    this.calculaBebidasGratis();
  }

  private calcula2x1() {
    //Calculando 2x1 en las pizzas
    //Obteniendo la lista desglosada de las pizzas para 2x1
    let listaPizzas2x1: ElementoPizza[] = [];
    for (let e of this.elementos) {
      if (e.esPizza) {
        if ((e as ElementoPizza).pizza.aplica2x1) {
          //Agregando a la lista de elementos pizza,
          //desglosados uno por uno según la cantidad
          let cantidad = e.cantidad;
          for (let i = 0; i < cantidad; i++) {
            let origen: ElementoPizza = e as ElementoPizza;
            let copia: ElementoPizza = cloneDeep(origen);
            copia.cantidad = 1;
            listaPizzas2x1.push(copia);
          }
          //Marcar para eliminar el elemento original del pedido
          e.eliminar = true;
        }
      }
    }
    //Eliminando del listado todos los marcados para eliminar
    const elementosPermanencen = this.elementos.filter(
      (elemento) => !elemento.eliminar
    );
    this.elementos = elementosPermanencen;

    //Listado completo de pizzas para 2x1
    console.log('Pizzas para 2x1:', listaPizzas2x1);

    if (listaPizzas2x1.length > 0) {
      //Determinando qué pizzas se cobran
      //El 2x1 aplica solamente si son del mismo tamaño
      let tamanio: string = listaPizzas2x1[0].pizza.tamanio;
      let secuencia: number = 1;
      let elementoAnterior: ElementoPizza = null as any;

      for (let ep of listaPizzas2x1) {
        ep.seCobraCompleto = true;
        if (tamanio != ep.pizza.tamanio) {
          tamanio = ep.pizza.tamanio;
          secuencia = 1;
          if (elementoAnterior) {
            elementoAnterior.seCobraCompleto = false;
          }
        }
        if (secuencia === 1) {
          ep.seCobra = true;
        } else {
          ep.seCobra = false;
        }
        secuencia++;
        if (secuencia > 2) {
          secuencia = 1;
        }
        elementoAnterior = ep;
      }
      if (elementoAnterior) {
        elementoAnterior.seCobraCompleto = false;
      }
    }

    console.log('*** pizzas 2x1 ***');

    for (let ep of listaPizzas2x1) {
      let linea = ep.descripcion;
      if (ep.seCobra && ep.seCobraCompleto) {
        linea += ' ' + ep.precioCompleto;
      }
      if (ep.seCobra && !ep.seCobraCompleto) {
        linea += ' ' + ep.precioPorUna;
      }

      if (ep.seCobra) {
        if (ep.seCobraCompleto) {
          linea += ' completo';
        } else {
          linea += ' precio por 1';
        }
      }

      console.log(linea);
    }

    //Agrega los elementos 2x1 procesados al pedido
    this.elementos.push(...listaPizzas2x1);
    //Ordena el pedido
    this.ordenarPedido();
  }

  private verificaValidezPromociones(): boolean {
    let todoBien = true;
    this.limpiaContabilizacionPromociones();

    for (let e of this.elementos) {
      if (e.esPromo) {
        let ep = e as ElementoPromocion;
        let promo: Promocion = (e as ElementoPromocion).promocion;

        ep.promocionValida = true;
        ep.textoPromocionValida = [];
        if (promo instanceof PromoPrecioEspecial) {
          //Si es promoción de precio especial, se verifica que se cumplan todas las condiciones
          let promoPE = promo as PromoPrecioEspecial;
          console.log(
            'Verificando promocion',
            promoPE.nombre,
            'con las categorías condicionales',
            promoPE.categoriasCondicion
          );
          ep.promocionValida = true;
          ep.textoPromocionValida = [];

          //Validando que las categorías en la parte condicional existan en el pedido
          let categoriaFaltante: Categoria = null as any;
          let faltaCategoria = false;
          let textoFaltantes: string[] = [];
          textoFaltantes.push(
            'Para hacer v\u00e1lida esta promoci\u00f3n falta agregar:'
          );
          for (let cat of promoPE.categoriasCondicion) {
            if (!this.existeCategoria(cat.codigo)) {
              faltaCategoria = true;
              categoriaFaltante = cat;
              textoFaltantes.push(
                categoriaFaltante.nombre + ' (' + categoriaFaltante.codigo + ')'
              );
            }
          }

          if (faltaCategoria) {
            ep.promocionValida = false;
            todoBien = false;
            ep.textoPromocionValida = textoFaltantes;
          }
        }
      }
    }

    this.limpiaContabilizacionPromociones();
    return todoBien;
  }

  private limpiaContabilizacionPromociones() {
    //Limpia la contabilización de promociones
    for (let e of this.elementos) {
      e.contabilizadaPromo = false;
      e.cantidadContabilizadaPromo = e.cantidad;
    }
  }

  private existeCategoria(codigo: string): boolean {
    let existe = false;
    for (let ele of this.elementos) {
      if (ele.esPizza) {
        let p = (ele as ElementoPizza).pizza;
        if (!ele.contabilizadaPromo && p.esDeCategoria(codigo)) {
          existe = true;
          if (ele.cantidadContabilizadaPromo > 1) {
            ele.cantidadContabilizadaPromo--;
          } else {
            ele.contabilizadaPromo = true;
          }
          break;
        }
      }
      if (ele.esProducto) {
        let p = (ele as ElementoProducto).producto;
        if (!ele.contabilizadaPromo && p.esDeCategoria(codigo)) {
          existe = true;
          if (ele.cantidadContabilizadaPromo > 1) {
            ele.cantidadContabilizadaPromo--;
          } else {
            ele.contabilizadaPromo = true;
          }
          break;
        }
      }
    }
    return existe;
  }

  private ordenarPedido() {
    //Ordena los elementos del pedido
    const elementosOrdenados = this.elementos.sort((a, b) => {
      //Primero por tipo (promoción, pizzas, productos) (ascendente)
      if (a.ordenTipo < b.ordenTipo) return -1;
      if (a.ordenTipo > b.ordenTipo) return 1;
      //Luego, si son pizzas, por tamaño (ascendente)
      if (a.esPizza && b.esPizza) {
        if (
          (a as ElementoPizza).pizza.ordenTamanioPizza <
          (b as ElementoPizza).pizza.ordenTamanioPizza
        )
          return -1;

        if (
          (a as ElementoPizza).pizza.ordenTamanioPizza >
          (b as ElementoPizza).pizza.ordenTamanioPizza
        )
          return 1;
      }
      //Luego por precio (descendente)
      if (a.precioCompleto < b.precioCompleto) return 1;
      if (a.precioCompleto > b.precioCompleto) return -1;

      return 0;
    });
  }

  private calculaBebidasGratis() {
    this.mensajeBebidas = null as any;
    let cantidadPosibles = 0;
    //Recorre los elementos para ver si son pizzas que participan en la promo de bebida gratis
    for (let e of this.elementos) {
      if (e.esPizza) {
        let pizza = (e as ElementoPizza).pizza;
        if (pizza.aplicaBebidaGratis) {
          cantidadPosibles += e.cantidad;
        }
      }
    }
    console.log('Es posible tener', cantidadPosibles, 'bebidas gratis');
    //Calcula cuantas bebidas que pudieran ser gratis hay en el pedido
    //Y aplica los descuentos
    let posibles = cantidadPosibles;
    let cantidadBebidasParticipantes = 0;
    for (let e of this.elementos) {
      if (e.esProducto) {
        let ep = e as ElementoProducto;
        //Limpia las bebidas gratis
        ep.tieneBebidaGratis = false;
        ep.cantidadBebidasGratis = 0;
        if (ep.producto.aplicaBebidaGratis) {
          cantidadBebidasParticipantes += e.cantidad;
          if (cantidadPosibles > 0) {
            //Se aplica la bebida gratis
            ep.tieneBebidaGratis = true;
            if (cantidadPosibles >= e.cantidad) {
              ep.cantidadBebidasGratis = e.cantidad;
              cantidadPosibles -= e.cantidad;
            } else {
              ep.cantidadBebidasGratis = cantidadPosibles;
              cantidadPosibles = 0;
            }
          }
        }
      }
    }
    console.log(
      'Hay',
      cantidadBebidasParticipantes,
      'bebidas que pueden ser gratis'
    );
    let pendientes = posibles - cantidadBebidasParticipantes;
    if (pendientes < 0) {
      pendientes = 0;
    }
    console.log('Se podrían tener', pendientes, ' bebidas m\u00e1s gratis');
    if (pendientes > 0) {
      this.mensajeBebidas = 'Puedes agregar ' + pendientes;
      let beb: string = 'bebidas';
      if (pendientes === 1) {
        beb = 'bebida';
      }
      this.mensajeBebidas +=
        ' ' + beb + ' gratis m\u00e1s (s\u00f3lo bebidas participantes)';
    }
  }
}
