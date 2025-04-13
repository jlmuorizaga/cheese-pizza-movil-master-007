import { Utilerias } from '../utilerias/Utilerias';

export class Orilla {
  id: string;
  descripcion: string;
  precio: number;
  idTamanio: string;

  constructor(
    id: string,
    descripcion: string,
    precio: number,
    idTamanio: string
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.precio = precio;
    this.idTamanio = idTamanio;
  }

  public get precioxMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.precio);
  }
}
