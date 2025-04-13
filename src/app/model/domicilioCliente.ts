export class DomicilioCliente {
  idDomicilioCliente: string;
  idCliente: string;
  idRegion: string;
  estado: string;
  ciudad: string;
  colonia: string;
  calle: string;
  numero: string;
  codigoPostal: string;
  informacionAdicional: string;
  latitud: number;
  longitud: number;
  activo: boolean;

  constructor(
    idDomicilioCliente: string,
    idCliente: string,
    idRegion: string,
    estado: string,
    ciudad: string,
    colonia: string,
    calle: string,
    numero: string,
    codigoPostal: string,
    informacionAdicional: string,
    latitud: number,
    longitud: number,
    activo: boolean
  ) {
    this.idDomicilioCliente = idDomicilioCliente;
    this.idCliente = idCliente;
    this.idRegion = idRegion;
    this.estado = estado;
    this.ciudad = ciudad;
    this.colonia = colonia;
    this.calle = calle;
    this.numero = numero;
    this.codigoPostal = codigoPostal;
    this.informacionAdicional = informacionAdicional;
    this.latitud = latitud;
    this.longitud = longitud;
    this.activo = activo;
  }

  public get domicilioCompleto(): string {
    let dc: string = '';
    dc += this.domicilio;
    dc += '|' + this.domicilioComplemento;

    return dc;
  }

  public get domicilioCompletoLineaContinua(): string {

    let parts: string[] = this.domicilioCompleto.split('|');
    //console.log('Domicilio completo: ', parts)
    let coma = '';
    let completo = '';
    for (let part of parts) {
      //console.log('Parte: ',part)
      completo += coma + part;
      coma = ', ';
    }
    return completo;
  }

  public get domicilio(): string {
    let dc: string = '';
    dc += this.calle;
    dc += ' ' + this.numero;

    return dc;
  }

  public get domicilioComplemento(): string {
    let dc: string = '';
    dc += this.colonia;
    dc += ', ' + this.ciudad;
    dc += '|C.P. ' + this.codigoPostal;
    if (this.informacionAdicional) {
      dc += '|(' + this.informacionAdicional + ')';
    }

    return dc;
  }

  public get domicilioComplementoDesglosado(): string[] {
    return this.domicilioComplemento.split('|');
  }
}
