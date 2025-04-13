import { Salsa } from './Salsa';
import { Seccion } from './Seccion';
import { TipoProducto } from './TipoProducto';

export class SeccionProductos extends Seccion {
  tiposProducto!: TipoProducto[];
  salsas!: Salsa[];
}
