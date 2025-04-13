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
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido.service';
import { PedidoProceso } from 'src/app/model/PedidoProceso';
import { TIPO_ENTREGA_SUCURSAL } from 'src/app/constantes/constantes';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { Sucursal } from 'src/app/model/Sucursal';

@Component({
  selector: 'app-pedido-proceso-datos',
  templateUrl: './pedido-proceso-datos.page.html',
  styleUrls: ['./pedido-proceso-datos.page.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardSubtitle,
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
  ],
})
export class PedidoProcesoDatosPage implements OnInit {
  pedido!: PedidoProceso;
  constructor(
    private route: ActivatedRoute,
    private pedidoSrv: PedidoService,
    private catalogoSrv: CatalogosService
  ) {}

  ngOnInit() {
    console.log('Entrando a datos de pedido en proceso');
    this.route.queryParams.subscribe((params) => {
      let idPedido = params['idPedido'];
      console.log('idPedido:', idPedido);
      //Lee datos del pedido
      this.pedidoSrv.obtenerDatosPedido(idPedido).subscribe({
        next: (res: PedidoProceso) => {
          this.pedido = res;
          if (this.pedido.modalidadEntrega === TIPO_ENTREGA_SUCURSAL) {
            //Leyendo datos de domicilio de la sucursal
            this.leeDomicilioSucursal();
          }
        },
        error: (error: any) => {
          console.log('Error al leer los datos del pedido');
        },
      });
    });
  }

  leeDomicilioSucursal() {
    this.catalogoSrv.obtenerSucursales().subscribe({
      next: (res: Sucursal[]) => {
        for (let s of res) {
          if (s.clave === this.pedido.claveSucursal) {
            this.pedido.datosDomicilioSucursal = s.domicilio;
          }
        }
      },
      error: (error: any) => {
        console.log('Error al leer el catálogo de sucursales');
      },
    });
  }
}
