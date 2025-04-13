import { ID_NULO } from '../constantes/constantes';
import { Utilerias } from '../utilerias/Utilerias';
import { Ingrediente } from './Ingrediente';
import { Orilla } from './Orilla';
import { ProductoGeneral } from './ProductoGeneral';
import { Validacion } from './Validacion';

export class Pizza extends ProductoGeneral {
  idEspecialidad: string;
  preciox2: number;
  preciox1: number;
  ingredientes: string;
  cantidadIngredientes: number;
  esDeUnIngrediente: boolean;
  orilla!: Orilla;
  orillas!: Orilla[];
  ingrediente!: Ingrediente;
  aplica2x1: boolean;
  aplicaBebidaGratis: boolean;
  ordenTamanioPizza: number;

  constructor(
    id: string,
    nombre: string,
    tamanio: string,
    ordenTamanioPizza: number,
    imgUrl: string,
    categoria1: string,
    categoria2: string,
    categoria3: string,
    idEspecialidad: string,
    preciox2: number,
    preciox1: number,
    ingredientes: string,
    cantidadIngredientes: number,
    esDeUnIngrediente: boolean,
    aplica2x1: boolean,
    aplicaBebidaGratis: boolean
  ) {
    super(id, nombre, tamanio, imgUrl, categoria1, categoria2, categoria3);
    this.idEspecialidad = idEspecialidad;
    this.preciox2 = preciox2;
    this.preciox1 = preciox1;
    this.ingredientes = ingredientes;
    this.cantidadIngredientes = cantidadIngredientes;
    this.esDeUnIngrediente = esDeUnIngrediente;
    this.aplica2x1 = aplica2x1;
    this.aplicaBebidaGratis = aplicaBebidaGratis;
    this.ordenTamanioPizza = ordenTamanioPizza;
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

  public get preciox2MXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.preciox2);
  }

  public get preciox1MXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.preciox1);
  }

  public get descripcionStr(): string {
    let desc = this.nombre + ' ' + this.tamanio;
    if (this.esDeUnIngrediente && this.ingrediente) {
      desc += ', Ingrediente: ' + this.ingrediente.nombre;
    }
    return desc;
  }

  public esValida(): Validacion {
    let val: Validacion = new Validacion();
    val.valido = true;
    val.mensaje = 'Todo bien';

    if (this.esDeUnIngrediente) {
      if (!this.ingrediente) {
        val.valido = false;
        val.mensaje = 'Falta seleccionar el ingrediente';
      } else {
        if (this.ingrediente.id === ID_NULO) {
          val.valido = false;
          val.mensaje = 'Falta seleccionar el ingrediente';
        }
      }
    }
    return val;
  }
}
