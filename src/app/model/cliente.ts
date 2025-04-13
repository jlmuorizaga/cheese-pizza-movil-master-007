import { DomicilioCliente } from './domicilioCliente';

export class Cliente {
  idCliente: string;
  correoElectronico: string;
  contrasenia!: string;
  mantenerSesion!: boolean;
  nombre: string;
  telefono: string;
  fechaRegistro: string;
  activo: boolean;
  domiciliosCliente!: DomicilioCliente[];
  domicilioSeleccionado!: DomicilioCliente;

  constructor(
    idCliente: string,
    correoElectronico: string,
    nombre: string,
    telefono: string,
    fechaRegistro: string,
    activo: boolean
  ) {
    this.idCliente = idCliente;
    this.correoElectronico = correoElectronico;
    this.nombre = nombre;
    this.telefono = telefono;
    this.fechaRegistro = fechaRegistro;
    this.activo = activo;
  }
}
