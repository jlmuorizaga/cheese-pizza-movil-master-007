import { Categoria } from './Categoria';
import { CategoriaMenu } from './CategoriaMenu';
import { Promocion } from './Promocion';
import { SeccionPizzas } from './SeccionPizzas';
import { SeccionProductos } from './SeccionProductos';
import { SeccionPromociones } from './SeccionPromociones';
import { TipoProducto } from './TipoProducto';
import { cloneDeep } from 'lodash';

export class Menu {
  seccionPromociones!: SeccionPromociones;
  seccionPizzas!: SeccionPizzas;
  seccionOtrosProductos!: SeccionProductos;
  categorias!: Categoria[];

  dameTipoProducto(idTipo: string): TipoProducto {
    let tipoProducto: TipoProducto = null as any;
    //Busca tipo de producto
    let tipos = this.seccionOtrosProductos.tiposProducto;
    let tipoEncontrado = tipos.find((tipo) => tipo.id === idTipo);
    if (tipoEncontrado) {
      tipoProducto = tipoEncontrado;
    }
    return tipoProducto;
  }

  damePromocion(idPromocion: string): Promocion {
    let promocion: Promocion = null as any;
    console.log('Buscando promoción');
    let promos = this.seccionPromociones.promociones;
    let promoEncotrada = promos.find((promo) => promo.id === idPromocion);
    if (promoEncotrada) {
      promocion = promoEncotrada;
      //Verificando si hay elementos de la promoción con una sola opción
      for (let cat of promocion.categoriasParaSeleccion) {
        if (
          cat.pizzasEnCategoria.length + cat.productosEnCategoria.length ===
          1
        ) {
          //Preseleccionar el producto, pues sólo hay uno
          if (cat.pizzasEnCategoria.length === 1) {
            cat.productoGeneralSeleccionado = cat.pizzasEnCategoria[0];
          }
          if (cat.productosEnCategoria.length === 1) {
            cat.productoGeneralSeleccionado = cat.productosEnCategoria[0];
          }
        }
      }
    }
    return promocion;
  }

  dameCategoria(codigo: string): Categoria {
    let categoria: Categoria = null as any;
    console.log('Buscando categoria');
    let cats = this.categorias;
    let catEncontrada = cats.find((cat) => cat.codigo === codigo);
    if (catEncontrada) {
      categoria = catEncontrada;
    } else {
      categoria = new CategoriaMenu(codigo, 'No definida (' + codigo + ')');
    }

    //categoria.pizzasEnCategoria = this.damePizzasPorCategoria(codigo);
    //categoria.productosEnCategoria = this.dameProductosPorCategoria(codigo);

    //Duplicando la categoría para manejarlas de manera independiente cuando en una
    //misma promoción se usa la misma categoría varias veces y que así no apunte realmente al
    //mismo objeto sino a otra instancia y en cada instancias se puedan elegir diferentes opciones
    //en las promociones

    const categoriaCopia = cloneDeep(categoria);

    return categoriaCopia;
  }
}
