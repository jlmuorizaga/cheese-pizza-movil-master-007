import { URL_API_IMAGENES } from '../constantes/constantes';
import { Categoria } from './Categoria';
import { CategoriaMenu } from './CategoriaMenu';

export abstract class ProductoGeneral {
  id: string;
  nombre: string;
  tamanio: string;
  imgUrl: string;
  categorias: Categoria[];

  constructor(
    id: string,
    nombre: string,
    tamanio: string,
    imgUrl: string,
    categoria1: string,
    categoria2: string,
    categoria3: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.tamanio = tamanio;
    this.imgUrl = imgUrl;

    let categorias: Categoria[] = [];
    if (categoria1) {
      let cat1: Categoria = new CategoriaMenu(categoria1, categoria1);
      categorias.push(cat1);
    }
    if (categoria2) {
      let cat2: Categoria = new CategoriaMenu(categoria2, categoria2);
      categorias.push(cat2);
    }
    if (categoria3) {
      let cat3: Categoria = new CategoriaMenu(categoria3, categoria3);
      categorias.push(cat3);
    }

    this.categorias = categorias;
  }

  public abstract get descripcionStr(): string;

  public esDeCategoria(codigo: string): boolean {
    let siEs = false;
    for (let cat of this.categorias) {
      if (cat.codigo === codigo) {
        siEs = true;
      }
    }
    return siEs;
  }

  public get imgUrlCompleta(): string {
    return URL_API_IMAGENES + this.imgUrl;
  }
}
