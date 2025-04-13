//Versión de la aplicación
export const VERSION_APP = '0.0.7';

//Distancias máximas
export const DISTANCIA_MAXIMA_REGION = 15.0;
export const DISTANCIA_MAXIMA_ENTREGA_DOMICILIO = 3.0;
export const DISTANCIA_MAXIMA_ENTREGA_SUCURSAL = 50.0;

//Monto mínimo de compra
export const MONTO_MINIMO_COMPRA = 100.0;

const URL_API_BASE = 'http://ec2-54-144-58-67.compute-1.amazonaws.com';
//const URL_API_BASE = 'http://localhost';
const PUERTO_API_CATALOGOS = '3001';
const PUERTO_API_CLIENTE = '3000';
const PUERTO_API_STRIPE = '3002';
const PUERTO_API_CORREO = '3003';
const PUERTO_API_PEDIDO = '3000';

export const URL_API_CATALOGOS = URL_API_BASE + ':' + PUERTO_API_CATALOGOS;
export const URL_API_CLIENTE = URL_API_BASE + ':' + PUERTO_API_CLIENTE;
export const URL_API_STRIPE = URL_API_BASE + ':' + PUERTO_API_STRIPE;
export const URL_API_CORREO = URL_API_BASE + ':' + PUERTO_API_CORREO;
export const URL_API_PEDIDO = URL_API_BASE + ':' + PUERTO_API_PEDIDO;

export const URL_API_IMAGENES = URL_API_BASE;

//Timeout para selección automática de región
export const TIMEOUT_SELECCION_REGION = 10;

//Tipos de promociones
export const PROMO_COMBO = 'CB';
export const PROMO_PRECIO_ESPECIAL = 'PE';

//Tipos de entrega
export const TIPO_ENTREGA_DOMICILIO = 'ED';
export const TIPO_ENTREGA_SUCURSAL = 'ES';
export const TIPO_ENTREGA_DOMICILIO_TEXTO = 'a domicilio';
export const TIPO_ENTREGA_SUCURSAL_TEXTO = 'en sucursal';

export const ID_NULO = '00000000-0000-0000-0000-000000000000';

export const SEPARADOR_DATOS = '|';

export const MUESTRA_CODIGO_CATEGORIAS = true;

export const CLIENTE_LOCAL_STORE_ID =
  'cliente_chpsystem_movil_c2b8a339-83e9-4182-829a-d34cf452a7da';

export const REGION_LOCAL_STORE_ID =
  'region_chpsystem_movil_0195d5e5-95ef-7d6a-ba24-852395516f31';

//Constantes de navegación
export const PAGINA_LOGIN = '/login';
export const PAGINA_SELECCION_REGION = '/seleccion-region-auto';
export const PAGINA_SELECCION_TIPO_ENTREGA = '/seleccion-tipo-entrega';

//Constantes estatus pedido
export const ESTATUS_PEDIDO_PREVIOPAGO = 'PP'; // 00 Pedido enviado a la nube desde la aplicación previo al pago
export const ESTATUS_PEDIDO_NUBE = 'NP'; // 01 Pedido enviado a la nube desde la aplicación ya pagado
export const ESTATUS_PEDIDO_RECIBIDO = 'RP'; // 02 Pedido recibido en la sucursal
export const ESTATUS_PEDIDO_CAPTURADO = 'CP'; // 03 En preparación (ha sido capturado en el punto de venta de la sucursal)
export const ESTATUS_PEDIDO_ENVIADO = 'EP'; // 04.1 Pedido enviado a domicilio
export const ESTATUS_PEDIDO_LISTO = 'LP'; // 04.2 Pedido listo para ser recogido en la sucursal
export const ESTATUS_PEDIDO_ATENDIDO = 'AP'; // 05 Pedido atendido (pasa al histórico)

export const ESTATUS_PEDIDO_PREVIOPAGO_MENSAJE = 'Pedido pendiente de pago'; // 00 Pedido enviado a la nube desde la aplicación previo al pago
export const ESTATUS_PEDIDO_NUBE_MENSAJE = 'Pedido registrado'; // 01 Pedido enviado a la nube desde la aplicación ya pagado
export const ESTATUS_PEDIDO_RECIBIDO_MENSAJE =
  'Hemos recibido tu pedido en la sucursal'; // 02 Pedido recibido en la sucursal
export const ESTATUS_PEDIDO_CAPTURADO_MENSAJE = 'Estamos preparando tu pedido'; // 03 En preparación (ha sido capturado en el punto de venta de la sucursal)
export const ESTATUS_PEDIDO_ENVIADO_MENSAJE =
  '\u00a1Pedido listo! fue enviado a tu domicilio'; // 04.1 Pedido enviado a domicilio
export const ESTATUS_PEDIDO_LISTO_MENSAJE =
  '\u00a1Pedido listo! puedes pasar por \u00e9l'; // 04.2 Pedido listo para ser recogido en la sucursal
export const ESTATUS_PEDIDO_ATENDIDO_MENSAJE = 'Pedido entregado'; // 05 Pedido atendido (pasa al histórico)

//Constantes tipo de pago
export const PAGO_EN_LINEA = 'PL';
