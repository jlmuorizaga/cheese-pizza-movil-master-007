export class PizzaAPI {
  idPizza: string;
  idEspecialidad: string;
  nombreEspecialidad: string;
  idTamanioPizza: string;
  tamanioPizza: string;
  ordenTamanioPizza: number;
  ingredientes: string;
  imgUrl: string;
  precioX2: number;
  precioX1: number;
  cantidadIngredientes: number;
  esDeUnIngrediente: boolean;
  aplica2x1: boolean;
  aplicaBebidaGratis: boolean;
  categoria1: string;
  categoria2: string;
  categoria3: string;

  constructor(
    idPizza: string,
    idEspecialidad: string,
    nombreEspecialidad: string,
    idTamanioPizza: string,
    tamanioPizza: string,
    ordenTamanioPizza: number,
    ingredientes: string,
    imgUrl: string,
    precioX2: number,
    precioX1: number,
    cantidadIngredientes: number,
    esDeUnIngrediente: boolean,
    aplica2x1: boolean,
    aplicaBebidaGratis: boolean,
    categoria1: string,
    categoria2: string,
    categoria3: string
  ) {
    this.idPizza = idPizza;
    this.idEspecialidad = idEspecialidad;
    this.nombreEspecialidad = nombreEspecialidad;
    this.idTamanioPizza = idTamanioPizza;
    this.tamanioPizza = tamanioPizza;
    this.ordenTamanioPizza = ordenTamanioPizza;
    this.ingredientes = ingredientes;
    this.imgUrl = imgUrl;
    this.precioX2 = precioX2;
    this.precioX1 = precioX1;
    this.cantidadIngredientes = cantidadIngredientes;
    this.esDeUnIngrediente = esDeUnIngrediente;
    this.aplica2x1 = aplica2x1;
    this.aplicaBebidaGratis = aplicaBebidaGratis;
    this.categoria1 = categoria1;
    this.categoria2 = categoria2;
    this.categoria3 = categoria3;
  }
}
