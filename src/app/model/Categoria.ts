import { Pizza } from './Pizza';
import { Producto } from './Producto';
import { ProductoGeneral } from './ProductoGeneral';

export abstract class Categoria {
  codigo: string;
  nombre: string;

  pizzasEnCategoria!: Pizza[];
  productosEnCategoria!: Producto[];

  //seleccionMenuPromo!: ProductoGeneral;
  productoGeneralSeleccionado!: ProductoGeneral;

  constructor(codigo: string, nombre: string) {
    this.codigo = codigo;
    this.nombre = nombre;
  }
}
