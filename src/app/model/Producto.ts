import { ID_NULO } from '../constantes/constantes';
import { Utilerias } from '../utilerias/Utilerias';
import { ProductoGeneral } from './ProductoGeneral';
import { Salsa } from './Salsa';
import { Validacion } from './Validacion';

export class Producto extends ProductoGeneral {
  precio: number;
  usaSalsa: boolean;
  aplicaBebidaGratis: boolean;
  salsaSeleccionada!: Salsa;

  constructor(
    id: string,
    nombre: string,
    tamanio: string,
    imgUrl: string,
    precio: number,
    usaSalsa: boolean,
    aplicaBebidaGratis: boolean,
    categoria1: string,
    categoria2: string,
    categoria3: string
  ) {
    super(id, nombre, tamanio, imgUrl, categoria1, categoria2, categoria3);
    this.precio = precio;
    this.usaSalsa = usaSalsa;
    this.aplicaBebidaGratis = aplicaBebidaGratis;
  }

  public get categoriasStr(): string {
    let categorias = '';
    let separador = '';
    for (let c of this.categorias) {
      categorias += separador + c.codigo;
      separador = ' ';
    }
    return categorias;
  }

  public esValido(): Validacion {
    let val: Validacion = new Validacion();
    val.valido = true;
    val.mensaje = 'Todo bien';
    if (this.usaSalsa) {
      if (!this.salsaSeleccionada) {
        val.valido = false;
        val.mensaje = 'Falta seleccionar la salsa';
      } else {
        if (this.salsaSeleccionada.id === ID_NULO) {
          val.valido = false;
          val.mensaje = 'Falta seleccionar la salsa';
        }
      }
    }
    return val;
  }

  public get descripcionStr(): string {
    let desc = this.nombre + ' ' + this.tamanio;
    if (this.usaSalsa && this.salsaSeleccionada) {
      desc += ' Salsa ' + this.salsaSeleccionada.nombre;
    }
    return desc;
  }

  public get precioMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.precio);
  }
}
