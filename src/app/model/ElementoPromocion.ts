import { Utilerias } from '../utilerias/Utilerias';
import { Categoria } from './Categoria';
import { Elemento } from './Elemento';
import { Orilla } from './Orilla';
import { Promocion } from './Promocion';
import { PromoCombo } from './PromoCombo';
import { PromoPrecioEspecial } from './PromoPrecioEspecial';

export class ElementoPromocion extends Elemento {
  promocionValida!: boolean;
  textoPromocionValida!: string[];

  public override get categoriasStr(): string {
    let categorias = '';
    let separador = '';
    if (this.promocion instanceof PromoCombo) {
      let p = this.promocion as PromoCombo;
      for (let c of p.categoriasParaSeleccion) {
        categorias += separador + c.codigo;
        separador = ' ';
      }
    }
    if (this.promocion instanceof PromoPrecioEspecial) {
      let p = this.promocion as PromoPrecioEspecial;
      for (let c of p.categoriasCondicion) {
        categorias += separador + c.codigo;
        separador = ' ';
      }
      categorias += ' | ';
      for (let c of p.categoriasParaSeleccion) {
        categorias += separador + c.codigo;
        separador = ' ';
      }
    }
    return categorias;
  }
  public override get esProducto(): boolean {
    return false;
  }
  public override get esPromocionValida(): boolean {
    return this.promocionValida;
  }
  public override get mensajeDePromocionValida(): string[] {
    return this.textoPromocionValida;
  }
  public override get casoPrecio(): string {
    return null as any;
  }
  public override get precioFinal(): number {
    //En las promociones el precio final es el precio completo
    return this.precioCompleto;
  }
  public override get precioFinalMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.precioFinal);
  }
  public override get precioPorUna(): number {
    return this.precio;
  }
  public override get precioCompleto(): number {
    return this.precio;
  }
  public override get orillaSeleccionada(): Orilla {
    return null as any;
  }
  public override get esPizza(): boolean {
    return false;
  }
  public override get ordenTipo(): number {
    return 1;
  }
  public override get articulosPromo(): Categoria[] {
    return this.promocion.categoriasParaSeleccion;
  }
  public override get esPromo(): boolean {
    return true;
  }
  public override get precio(): number {
    return this.promocion.precio;
  }
  public override get precioMXN(): string {
    return this.promocion.precioMXN;
  }
  public override get descripcion(): string {
    let desc = this.promocion.descripcionStr;
    return desc;
  }
  public override get subtotal(): number {
    return this.cantidad * this.precioFinal;
  }
  public override get subTotalMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.subtotal);
  }
  promocion!: Promocion;
}
