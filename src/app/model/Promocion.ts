import { URL_API_IMAGENES } from '../constantes/constantes';
import { Utilerias } from '../utilerias/Utilerias';
import { Categoria } from './Categoria';

export abstract class Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imgUrl: string;
  diasSemana: string;

  //promocionValida!: boolean;
  //textoPromocionValida!: string;

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    precio: number,
    imgUrl: string,
    diasSemana: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imgUrl = imgUrl;
    this.diasSemana = diasSemana;
  }

  public abstract get categoriasParaSeleccion(): Categoria[];

  public get imgUrlCompleta(): string {
    return URL_API_IMAGENES + this.imgUrl;
  }

  public get descripcionStr(): string {
    let desc = this.nombre;
    return desc;
  }

  public get precioMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.precio);
  }
}
