import { Categoria } from './Categoria';
import { Menu } from './Menu';
import { Promocion } from './Promocion';

export class PromoCombo extends Promocion {
  categorias!: Categoria[];

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
    //Si es una promoción de tipo combo sólo hay una lista de categorías
    this.categorias = [];
    let categorias = this.categorias;
    let cats = definicion.split('+');
    for (let cat of cats) {
      let categoria = menu.dameCategoria(cat);
      categorias.push(categoria);
    }
  }

  public override get categoriasParaSeleccion(): Categoria[] {
    return this.categorias;
  }
}
