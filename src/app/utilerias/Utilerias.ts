import { v7 as uuidv7 } from 'uuid';

export class Utilerias {
  public static generaID(): string {
    const uuid = uuidv7();
    return uuid;
  }

  static convierteNumeroAMoneda(numero: number): string {
    //console.log('Convirtiendo a moneda ' + numero);
    let resultado: string;
    if (numero != null) {
      const formatoMoneda: string = numero.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      });
      resultado = formatoMoneda;
    } else {
      resultado = 'X ' + numero;
    }
    //console.log('Resultado: ' + resultado);
    return resultado;
  }

  static convierteNumeroAFormatoLocal(
    numero: number,
    digitosDecimales: number
  ): string {
    let resultado: string;
    if (numero != null) {
      const opciones: Intl.NumberFormatOptions = {
        minimumFractionDigits: digitosDecimales,
        maximumFractionDigits: digitosDecimales,
      };
      const formatoLocal: string = numero.toLocaleString('es-MX', opciones);
      resultado = formatoLocal;
    } else {
      resultado = 'X ' + numero;
    }
    //console.log('Resultado: ' + resultado);
    return resultado;
  }

  static getRandomNumber1a5(): number {
    return Math.floor(Math.random() * 5) + 1;
  }

  public static generaCodigoVerificacion(): string {
    const longitud = 6;
    let numeroAzar = '';

    for (let i = 0; i < longitud; i++) {
      const digitoAzar = Math.floor(Math.random() * 10);
      numeroAzar += digitoAzar.toString();
    }

    return numeroAzar;
  }
  static fechaActual() {
    let fechaHoy = new Date();
    let anio = fechaHoy.getFullYear();
    let mes = fechaHoy.getMonth();
    let dia = fechaHoy.getDate();
    let hora = fechaHoy.getHours();
    let minuto = fechaHoy.getMinutes();
    let segundo = fechaHoy.getSeconds();
    let milisegundos = fechaHoy.getMilliseconds();
    let fechaStr =
      this.convertirNumero(anio, 4) +
      this.convertirNumero(mes + 1, 2) +
      this.convertirNumero(dia, 2) +
      this.convertirNumero(hora, 2) +
      this.convertirNumero(minuto, 2) +
      this.convertirNumero(segundo, 2) +
      this.convertirNumero(milisegundos, 3);
    return fechaStr;
  }

  private static convertirNumero(numero: number, longitud: number): string {
    let numeroString = numero.toString();

    while (numeroString.length < longitud) {
      numeroString = '0' + numeroString;
    }

    return numeroString;
  }

  static formatDateTimeWithMonthName(input: string): string {
    if (input.length !== 17) {
      throw new Error('El string debe contener exactamente 17 dígitos.');
    }

    // Extraer partes de la fecha y hora
    const year = input.substring(0, 4);
    const month = input.substring(4, 6);
    const day = input.substring(6, 8);
    const hour = input.substring(8, 10);
    const minutes = input.substring(10, 12);

    // Lista de nombres de meses
    const monthNames = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    // Obtener el nombre del mes (convertir el índice del mes a número y restar 1 porque el array es 0-based)
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Formatear la fecha y hora
    return `${day} de ${monthName} de ${year} ${hour}:${minutes}`;
  }
}
