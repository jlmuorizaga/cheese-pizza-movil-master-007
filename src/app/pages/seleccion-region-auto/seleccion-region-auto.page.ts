import { PuntoVenta } from 'src/app/model/PuntoVenta';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { DatosEncabezadoComponent } from '../../components/datos-encabezado/datos-encabezado.component';
import { Geolocation } from '@capacitor/geolocation';
import {
  DISTANCIA_MAXIMA_REGION,
  PAGINA_SELECCION_TIPO_ENTREGA,
  REGION_LOCAL_STORE_ID,
  VERSION_APP,
} from 'src/app/constantes/constantes';
import { Region } from 'src/app/model/Region';
import { NavController } from '@ionic/angular';
import { CatalogosService } from 'src/app/services/catalogos.service';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-seleccion-region-auto',
  templateUrl: './seleccion-region-auto.page.html',
  styleUrls: ['./seleccion-region-auto.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonButton,
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
    DatosEncabezadoComponent,
  ],
})
export class SeleccionRegionAutoPage implements OnInit {
  versionApp = VERSION_APP;
  puntoVenta: PuntoVenta;

  detectandoAutomaticamente: boolean = false;
  regiones!: Region[];
  region!: Region;

  seleccionManual: boolean = false;

  // Variables para almacenar las coordenadas o el mensaje de error
  coordenadas: {
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null = null;
  error: string | null = null;

  constructor(
    private navCtrl: NavController,
    private catalogosSrv: CatalogosService
  ) {
    this.puntoVenta = PuntoVenta.getInstance();
  }

  ngOnInit() {
    console.log('Página de selección automática de la región');
    this.asignarRegionAutomatica();
  }

  asignarRegionAutomatica() {
    this.detectandoAutomaticamente = true;
    //Verificamos si ya se tiene asignada la región en el almacenamiento local
    const regionGuardada = localStorage.getItem(REGION_LOCAL_STORE_ID);
    if (regionGuardada) {
      //Sí se encontró la región
      const region: Region = JSON.parse(regionGuardada);
      console.log('Region almacenada:', region);
      //Asignando la región
      this.asignaRegionPuntoVenta(region);
      this.saltaASeleccionTipoEntrega();
      this.detectandoAutomaticamente = false;
      return;
    }
    //No se tiene la región almacenada
    //Obteniendo las coordenadas para usarlas como base para asignar la región
    this.obtenerUbicacionParaAsignarRegion();
  }

  async obtenerUbicacionParaAsignarRegion() {
    this.seleccionManual = false;
    this.detectandoAutomaticamente = true;
    console.log('Obteniendo coordenadas para asignar región');
    // Reiniciamos las variables cada vez que se intenta obtener la ubicación
    this.error = null;
    this.coordenadas = null;

    try {
      // Verificar si ya se tiene permiso para acceder a la ubicación
      const permiso = await Geolocation.checkPermissions();
      if (permiso.location !== 'granted') {
        // Solicitar permiso si no está concedido
        const solicitudPermiso = await Geolocation.requestPermissions();
        if (solicitudPermiso.location !== 'granted') {
          this.error =
            'Permiso denegado. Por favor, concede el permiso de ubicación en la configuración.';
          this.detectandoAutomaticamente = false;
          return;
        }
      }

      // Obtener la posición actual
      const position = await Geolocation.getCurrentPosition();
      if (position && position.coords) {
        this.coordenadas = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        this.buscaRegionParaAsignar();
      } else {
        this.error = 'No se pudieron obtener tus coordenadas.';

        this.seleccionManualDeRegion();
      }
    } catch (err) {
      console.error(err);
      this.error = 'No se pudieron obtener tus coordenadas.';
      this.seleccionManualDeRegion();
    }
  }

  buscaRegionParaAsignar() {
    console.log('Selección autormática de la región');
    //Leyendo las regiones
    this.catalogosSrv.obtenerRegiones().subscribe({
      next: (respuesta) => {
        this.regiones = respuesta;
        //Calcula la distancia del usuario a cada región
        this.calculaDistanciasRegiones();
        console.log('Regiones:', this.regiones);
        //Seleccionando la región del usuario
        const regionEnRango = this.obtenMejorRegion();
        if (regionEnRango) {
          this.asignaRegionPuntoVenta(regionEnRango);
          this.saltaASeleccionTipoEntrega();
        } else {
          this.seleccionManualDeRegion();
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  seleccionManualDeRegion() {
    console.log('Selección manual de la región');
    this.detectandoAutomaticamente = false;
    //Leyendo las regiones
    this.catalogosSrv.obtenerRegiones().subscribe({
      next: (respuesta) => {
        this.regiones = respuesta;
        console.log('Regiones:', this.regiones);
        this.seleccionManual = true;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private calculaDistanciasRegiones() {
    if (this.coordenadas) {
      //Punto de la ubicación del usuario
      const puntoUsuario = turf.point([
        this.coordenadas.longitude,
        this.coordenadas.latitude,
      ]);
      for (let r of this.regiones) {
        if (r.latitud && r.longitud) {
          const puntoRegion = turf.point([r.longitud, r.latitud]);
          // Calcular distancia (por defecto en kilómetros)
          const distancia = turf.distance(puntoUsuario, puntoRegion);
          r.distancia = distancia;
        }
      }
    }
  }

  private obtenMejorRegion(): Region {
    let regionEnRango: Region = null as any;
    //Caculando la region del usuario
    console.log('Calculando la región más adecuada');
    let distanciaMinima: number = Number.MAX_VALUE;
    let regionCercana: Region = null as any;

    //Busca la región que está a menor distancia
    for (let r of this.regiones) {
      if (r.distancia < distanciaMinima) {
        distanciaMinima = r.distancia;
        regionCercana = r;
      }
    }
    //Verifica si la región a menos distancia se encuentra dentro de la distancia máxima de
    // una región
    if (regionCercana) {
      if (regionCercana.distancia <= DISTANCIA_MAXIMA_REGION) {
        //Éxito al encontrar la región
        regionEnRango = regionCercana;
      }
    }
    return regionEnRango;
  }

  botonSeleccionaRegion(region: Region) {
    this.asignaRegionPuntoVenta(region);
    this.saltaASeleccionTipoEntrega();
  }

  asignaRegionPuntoVenta(region: Region) {
    //Asigna la región al punto de venta y las coordenadas del usuario
    this.region = region;
    this.puntoVenta.regionActual = this.region;
    if (this.coordenadas) {
      this.puntoVenta.latitud = this.coordenadas.latitude;
      this.puntoVenta.longitud = this.coordenadas.longitude;
      this.puntoVenta.exactitud = this.coordenadas.accuracy;
    }
  }

  saltaASeleccionTipoEntrega() {
    console.log('********************************');
    console.log('Salta a:', PAGINA_SELECCION_TIPO_ENTREGA);
    console.log('Región:', this.region);
    console.log('********************************');
    this.navCtrl.navigateRoot(PAGINA_SELECCION_TIPO_ENTREGA);
  }
}
