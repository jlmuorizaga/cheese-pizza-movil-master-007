import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'seleccion-tipo-entrega',
    loadComponent: () => import('./pages/seleccion-tipo-entrega/seleccion-tipo-entrega.page').then( m => m.SeleccionTipoEntregaPage)
  },
  {
    path: 'seleccion-sucursal',
    loadComponent: () => import('./pages/seleccion-sucursal/seleccion-sucursal.page').then( m => m.SeleccionSucursalPage)
  },
  {
    path: 'seleccion-domicilio',
    loadComponent: () => import('./pages/seleccion-domicilio/seleccion-domicilio.page').then( m => m.SeleccionDomicilioPage)
  },
  {
    path: 'menu-principal',
    loadComponent: () => import('./pages/menu-principal/menu-principal.page').then( m => m.MenuPrincipalPage)
  },
  {
    path: 'menu-promociones',
    loadComponent: () => import('./pages/menu-promociones/menu-promociones.page').then( m => m.MenuPromocionesPage)
  },
  {
    path: 'menu-pizzas',
    loadComponent: () => import('./pages/menu-pizzas/menu-pizzas.page').then( m => m.MenuPizzasPage)
  },
  {
    path: 'menu-productos',
    loadComponent: () => import('./pages/menu-productos/menu-productos.page').then( m => m.MenuProductosPage)
  },
  {
    path: 'menu-productos-tipos',
    loadComponent: () => import('./pages/menu-productos-tipos/menu-productos-tipos.page').then( m => m.MenuProductosTiposPage)
  },
  {
    path: 'pedido',
    loadComponent: () => import('./pages/pedido/pedido.page').then( m => m.PedidoPage)
  },
  {
    path: 'arma-promocion',
    loadComponent: () => import('./pages/arma-promocion/arma-promocion.page').then( m => m.ArmaPromocionPage)
  },
  {
    path: 'menu-pizzas-seleccion',
    loadComponent: () => import('./pages/menu-pizzas-seleccion/menu-pizzas-seleccion.page').then( m => m.MenuPizzasSeleccionPage)
  },
  {
    path: 'pedido-pago',
    loadComponent: () => import('./pages/pedido-pago/pedido-pago.page').then( m => m.PedidoPagoPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro-cliente-correo',
    loadComponent: () => import('./pages/registro-cliente-correo/registro-cliente-correo.page').then( m => m.RegistroClienteCorreoPage)
  },
  {
    path: 'login-recupera',
    loadComponent: () => import('./pages/login-recupera/login-recupera.page').then( m => m.LoginRecuperaPage)
  },
  {
    path: 'registro-cliente',
    loadComponent: () => import('./pages/registro-cliente/registro-cliente.page').then( m => m.RegistroClientePage)
  },
  {
    path: 'pedido-proceso-datos',
    loadComponent: () => import('./pages/pedido-proceso-datos/pedido-proceso-datos.page').then( m => m.PedidoProcesoDatosPage)
  },
  {
    path: 'captura-domicilio',
    loadComponent: () => import('./pages/captura-domicilio/captura-domicilio.page').then( m => m.CapturaDomicilioPage)
  },
  {
    path: 'seleccion-region-manual',
    loadComponent: () => import('./pages/seleccion-region-manual/seleccion-region-manual.page').then( m => m.SeleccionRegionManualPage)
  },
  {
    path: 'edita-datos-cliente',
    loadComponent: () => import('./pages/edita-datos-cliente/edita-datos-cliente.page').then( m => m.EditaDatosClientePage)
  },
  {
    path: 'seleccion-region-auto',
    loadComponent: () => import('./pages/seleccion-region-auto/seleccion-region-auto.page').then( m => m.SeleccionRegionAutoPage)
  },


];
