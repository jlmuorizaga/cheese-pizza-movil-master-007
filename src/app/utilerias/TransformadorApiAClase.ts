import { PromoPrecioEspecial } from './../model/PromoPrecioEspecial';
import { PROMO_COMBO, PROMO_PRECIO_ESPECIAL } from '../constantes/constantes';
import { Promocion } from '../model/Promocion';
import { PromoCombo } from '../model/PromoCombo';
import { Pizza } from '../model/Pizza';
import { Especialidad } from '../model/Especialidad';
import { Menu } from '../model/Menu';
import { PromocionAPI } from '../model/PromocionAPI';
import { PizzaAPI } from '../model/PizzaAPI';
import { Orilla } from '../model/Orilla';

export class TransformadorApiAClase {
  public static listaEspecialidades(
    resultado: PizzaAPI[],
    orillas: Orilla[]
  ): Especialidad[] {
    let listaEspecialidades: Especialidad[] = [];
    let listaPizzas: Pizza[] = [];
    for (let pizzaApi of resultado) {
      let pizza = new Pizza(
        pizzaApi.idPizza,
        pizzaApi.nombreEspecialidad,
        pizzaApi.tamanioPizza,
        pizzaApi.ordenTamanioPizza,
        pizzaApi.imgUrl,
        pizzaApi.categoria1,
        pizzaApi.categoria2,
        pizzaApi.categoria3,
        pizzaApi.idEspecialidad,
        pizzaApi.precioX2,
        pizzaApi.precioX1,
        pizzaApi.ingredientes,
        pizzaApi.cantidadIngredientes,
        pizzaApi.esDeUnIngrediente,
        pizzaApi.aplica2x1,
        pizzaApi.aplicaBebidaGratis
      );
      //Agregando orillas de queso
      let oris: Orilla[] = [];
      for (let o of orillas) {
        if (o.idTamanio === pizzaApi.idTamanioPizza) {
          oris.push(o);
        }
      }
      pizza.orillas = oris;

      //Obteniendo las especialidades
      let especialidad = new Especialidad(
        pizzaApi.idEspecialidad,
        pizzaApi.nombreEspecialidad,
        pizzaApi.ingredientes,
        pizzaApi.esDeUnIngrediente,
        pizzaApi.imgUrl
      );
      //Agrega la especialidad solamente si no existe en la lista
      if (!listaEspecialidades.some((e) => e.id === especialidad.id)) {
        listaEspecialidades.push(especialidad);
      }
      listaPizzas.push(pizza);
    }
    //Agregando las pizzas a su especialidad
    for (let especialidad of listaEspecialidades) {
      especialidad.pizzas = listaPizzas.filter(
        (p) => p.idEspecialidad === especialidad.id
      );
    }

    return listaEspecialidades;
  }

  public static listaPromociones(
    resultado: PromocionAPI[],
    menu: Menu
  ): Promocion[] {
    let lista: Promocion[] = [];
    for (let promocionApi of resultado) {
      let promocion: Promocion = null as any;
      //Verificando qué tipo de promoción es
      let tipoPromo = promocionApi.tipo;
      if (tipoPromo === PROMO_COMBO) {
        promocion = new PromoCombo(
          promocionApi.id,
          promocionApi.nombre,
          promocionApi.descripcion,
          promocionApi.precio,
          promocionApi.imgUrl,
          promocionApi.diasSemana,
          promocionApi.definicion,
          menu
        );
      } else if (tipoPromo === PROMO_PRECIO_ESPECIAL) {
        promocion = new PromoPrecioEspecial(
          promocionApi.id,
          promocionApi.nombre,
          promocionApi.descripcion,
          promocionApi.precio,
          promocionApi.imgUrl,
          promocionApi.diasSemana,
          promocionApi.definicion,
          menu
        );
      }
      if (promocion) {
        lista.push(promocion);
      }
    }

    return lista;
  }
}
