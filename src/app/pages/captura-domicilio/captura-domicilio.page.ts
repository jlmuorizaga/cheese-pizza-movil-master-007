import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { Utilerias } from 'src/app/utilerias/Utilerias';
import { DomicilioClienteNube } from 'src/app/model/DomicilioClienteNube';
import { ClienteService } from 'src/app/services/cliente.service';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';

// Declaramos la variable global para Google Maps
declare var google: any;

@Component({
  selector: 'app-captura-domicilio',
  templateUrl: './captura-domicilio.page.html',
  styleUrls: ['./captura-domicilio.page.scss'],
  standalone: true,
  imports: [
    IonCol,
    IonRow,
    IonGrid,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    DatosEncabezadoComponent
  ],
})
export class CapturaDomicilioPage implements OnInit {
  puntoVenta: PuntoVenta;

  // Se define el formulario reactivo
  domicilioForm = this.fb.group({
    calle: ['', Validators.required],
    numero: ['', Validators.required],
    // Valida que el código postal tenga exactamente 5 dígitos
    codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    estado: ['', Validators.required],
    ciudad: ['', Validators.required],
    colonia: ['', Validators.required],
    infoAdicional: [''],
  });

  // Objeto que contendrá los datos del domicilio junto con latitud y longitud
  direccionCompleta: any = null;
  loading = false;

  // Referencia al contenedor donde se cargará el mapa
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private clienteSrv: ClienteService,
    private navCtrl: NavController
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Captura de domicilio del cliente');
  }

  verificarUbicacion() {
    if (this.domicilioForm.invalid) {
      return; // No procede si el formulario es inválido
    }

    this.loading = true;
    const formValues = this.domicilioForm.value;
    // Construir la dirección concatenando los campos capturados
    const address = `${formValues.calle} ${formValues.numero}, ${formValues.colonia}, ${formValues.ciudad}, ${formValues.estado}, ${formValues.codigoPostal}`;

    const apiKey = 'AIzaSyD8XoRg5EFBCi2DUe_9gDi9dJfbTAitmfo'; // Reemplaza con tu clave real
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    // Llamada al API de Google Geocoding para obtener las coordenadas
    this.http
      .get(url, {
        params: {
          address,
          key: apiKey,
        },
      })
      .subscribe({
        next: (response: any) => {
          if (
            response.status === 'OK' &&
            response.results &&
            response.results.length > 0
          ) {
            const location = response.results[0].geometry.location;
            // Se arma el objeto con los datos del formulario más la latitud y longitud
            this.direccionCompleta = {
              ...formValues,
              lat: location.lat,
              lng: location.lng,
            };

            // Se espera un breve instante para que Angular renderice el contenedor del mapa,
            // y luego se inicializa el mapa.
            setTimeout(() => {
              this.initMap();
            }, 100);
          } else {
            console.error(
              'Dirección no encontrada o error en la API',
              response
            );
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al llamar a Google Geocoding API', error);
          this.loading = false;
        },
      });
  }

  /**
   * Inicializa el mapa de Google, centrado en la ubicación capturada,
   * y coloca un marcador señalando el domicilio.
   */
  initMap() {
    if (!this.mapContainer) return;
    const mapOptions = {
      center: {
        lat: this.direccionCompleta.lat,
        lng: this.direccionCompleta.lng,
      },
      zoom: 15,
    };
    // Crea el mapa dentro del contenedor
    const map = new google.maps.Map(
      this.mapContainer.nativeElement,
      mapOptions
    );

    // Coloca un marcador en la ubicación
    new google.maps.Marker({
      position: {
        lat: this.direccionCompleta.lat,
        lng: this.direccionCompleta.lng,
      },
      map: map,
      title: 'Domicilio',
    });
  }

  guardarDomicilio() {
    console.log('Grabando domicilio');
    //Crea objeto con domicilio
    const idUnico = Utilerias.generaID();
    const idCliente = this.puntoVenta.cliente.idCliente;
    const idRegion = this.puntoVenta.regionActual.id;

    let dc = new DomicilioClienteNube();
    dc.idDomicilioCliente = idUnico;
    dc.idCliente = idCliente;
    dc.idRegion = idRegion;
    dc.activo = 'S';
    dc.calle = this.direccionCompleta.calle;
    dc.ciudad = this.direccionCompleta.ciudad;
    dc.codigoPostal = this.direccionCompleta.codigoPostal;
    dc.colonia = this.direccionCompleta.colonia;
    dc.estado = this.direccionCompleta.estado;
    dc.informacionAdicional = this.direccionCompleta.infoAdicional;
    dc.latitud = this.direccionCompleta.lat;
    dc.longitud = this.direccionCompleta.lng;
    dc.numero = this.direccionCompleta.numero;

    console.log('Domicilio a grabar', dc);

    this.clienteSrv.insertaDomicilioCliente(dc).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        //Salta a selección de domicilios
        this.navCtrl.navigateBack('/seleccion-domicilio');
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
