import { URL_API_IMAGENES } from '../constantes/constantes';
import { Producto } from './Producto';

export class TipoProducto {
  id: string;
  nombre: string;
  descripcion: string;
  urlImg: string;
  productos!: Producto[];

  constructor(id: string, nombre: string, descripcion: string, urlImg: string) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.urlImg = urlImg;
  }

  public get imgUrlCompleta(): string {
    return URL_API_IMAGENES + this.urlImg;
  }

  public get nombreMinusculas(): string {
    return this.nombre.toLocaleLowerCase();
  }
}
