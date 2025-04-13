import { Injectable } from '@angular/core';
import { DatosCorreo } from '../model/DatosCorreo';
import { HttpClient } from '@angular/common/http';
import { URL_API_CORREO } from '../constantes/constantes';

@Injectable({
  providedIn: 'root',
})
export class CorreoService {
  constructor(private http: HttpClient) {}

  recuperaContrasenia(datosCorreo: DatosCorreo) {
    const apiURL = URL_API_CORREO + '/recupera-correo';
    return this.http.post(apiURL, datosCorreo);
  }

  verificaCorreo(datosCorreo: DatosCorreo) {
    const apiURL = URL_API_CORREO + '/verifica-correo';
    return this.http.post(apiURL, datosCorreo);
  }
}
