import { ID_NULO } from './../constantes/constantes';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ClienteAcceso } from '../model/clienteAcceso';
import { URL_API_CLIENTE } from '../constantes/constantes';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../model/cliente';
import { ClienteRegistro } from '../model/ClienteRegistro';
import { DomicilioCliente } from '../model/domicilioCliente';
import { DomicilioClienteNube } from '../model/DomicilioClienteNube';
import { Credenciales } from '../model/Credenciales';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private http: HttpClient) {}

  verificaAccesoCliente(credenciales: Credenciales) {
    const apiURL = URL_API_CLIENTE + '/login';
    return this.http.post(apiURL, credenciales);
  }

  leeDatosCliente(correo: string): Observable<Cliente> {
    const apiURL = URL_API_CLIENTE + '/clientes/' + correo;
    return this.http
      .get<any>(apiURL)
      .pipe(
        map(
          (data) =>
            new Cliente(
              data.idCliente,
              data.correoElectronico,
              data.nombre,
              data.telefono,
              data.fechaRegistro,
              data.activo === 'S'
            )
        )
      );
  }

  leeExisteCorreo(ce: string) {
    const apiURL = URL_API_CLIENTE + '/clientes/acceso/' + ce;
    return this.http.get(apiURL);
  }

  insertaRegistroCliente(cliente: ClienteRegistro) {
    const apiURL = URL_API_CLIENTE + '/clientes';
    return this.http.post(apiURL, cliente);
  }

  // Método para actualizar el cliente. Se espera que el objeto incluya el campo idCliente.
  actualizarCliente(cliente: ClienteRegistro): Observable<any> {
    const apiURL = URL_API_CLIENTE + '/clientes/' + cliente.idCliente;
    return this.http.put(apiURL, cliente);
  }

  leeDomiciliosCliente(idCliente: string): Observable<DomicilioCliente[]> {
    const apiURL = URL_API_CLIENTE + '/domicilios-cliente/' + idCliente;
    return this.http
      .get<any[]>(apiURL)
      .pipe(
        map((data: any[]) =>
          data.map(
            (item) =>
              new DomicilioCliente(
                item.idDomicilioCliente,
                item.idCliente,
                item.idRegion,
                item.estado,
                item.ciudad,
                item.colonia,
                item.calle,
                item.numero,
                item.codigoPostal,
                item.informacionAdicional,
                item.latitud,
                item.longitud,
                item.activo
              )
          )
        )
      );
  }

  insertaDomicilioCliente(domicilio: DomicilioClienteNube) {
    const apiURL = URL_API_CLIENTE + '/domicilios-cliente';
    return this.http.post(apiURL, domicilio);
  }

  eliminaDomicilio(idDomicilio: string) {
    const apiURL = URL_API_CLIENTE + '/domicilios-cliente/' + idDomicilio;
    return this.http.delete(apiURL);
  }
}
