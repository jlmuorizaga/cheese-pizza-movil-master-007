import { Categoria } from './Categoria';
import { Promocion } from './Promocion';

export class PromocionAPI extends Promocion {
  tipo: string;
  definicion: string;

  constructor(
    id: string,
    nombre: string,
    descripcion: string,
    precio: number,
    imgUrl: string,
    diasSemana: string,
    tipo: string,
    definicion: string
  ) {
    super(id, nombre, descripcion, precio, imgUrl, diasSemana);
    this.tipo = tipo;
    this.definicion = definicion;
  }

  public override get categoriasParaSeleccion(): Categoria[] {
    throw new Error('Method not implemented.');
  }
}
