export class Region {
  id: string;
  nombre: string;
  //poligono!: string;
  latitud: number;
  longitud: number;
  distancia!: number;

  constructor(id: string, nombre: string, latitud: number, longitud: number) {
    this.id = id;
    this.nombre = nombre;
    this.latitud = latitud;
    this.longitud = longitud;
  }
}
