import { Categoria } from './Categoria';
import { Menu } from './Menu';
import { Promocion } from './Promocion';

export class PromoPrecioEspecial extends Promocion {
  categoriasCondicion!: Categoria[];
  categoriasPrecioEspecial!: Categoria[];

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    precio: number,
    imgUrl: string,
    diasSemana: string,
    definicion: string,
    menu: Menu
  ) {
    super(id, nombre, descripcion, precio, imgUrl, diasSemana);

    //Asignando categorías
    //Si es una promoción tipo precio especial hay dos listas de categorías:
    // la condicional y a la que se le aplica el precio
    this.categoriasCondicion = [];
    this.categoriasPrecioEspecial = [];
    let categoriasCondicion = this.categoriasCondicion;
    let categoriasPrecioEspecial = this.categoriasPrecioEspecial;
    let partes = definicion.split('=');
    let catsCondicion = partes[0].split('+');
    let catsPE = partes[1].split('+');
    for (let cat of catsCondicion) {
      let categoria = menu.dameCategoria(cat);
      categoriasCondicion.push(categoria);
    }
    for (let cat of catsPE) {
      let categoria = menu.dameCategoria(cat);
      categoriasPrecioEspecial.push(categoria);
    }
  }

  public override get categoriasParaSeleccion(): Categoria[] {
    return this.categoriasPrecioEspecial;
  }
}
