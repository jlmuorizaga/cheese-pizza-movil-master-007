import { URL_API_IMAGENES } from '../constantes/constantes';
import { Ingrediente } from './Ingrediente';
import { Pizza } from './Pizza';
import { Validacion } from './Validacion';

export class Especialidad {
  id: string;
  nombre: string;
  ingredientes: string;
  esDeUnIngrediente: boolean;
  pizzas!: Pizza[];
  imgUrl: string;

  pizzaSeleccionada!: Pizza;
  ingredienteSeleccionado!: Ingrediente;

  constructor(
    id: string,
    nombre: string,
    ingredientes: string,
    esDeUnIngrediente: boolean,
    imgUrl: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.ingredientes = ingredientes;
    this.esDeUnIngrediente = esDeUnIngrediente;
    this.imgUrl = imgUrl;
  }

  public esValida(): Validacion {
    let val: Validacion = new Validacion();
    val.valido = true;
    val.mensaje = 'Todo bien';
    if (!this.pizzaSeleccionada) {
      val.valido = false;
      val.mensaje = 'Falta seleccionar el tama\u00f1o';
      console.log('Validación antes de enviar', val);
      return val;
    }
    let pizza: Pizza = this.pizzaSeleccionada;
    let valPizza = pizza.esValida();
    if (!valPizza.valido) {
      return valPizza;
    }
    return val;
  }

  public get imgUrlCompleta(): string {
    return URL_API_IMAGENES + this.imgUrl;
  }
}
