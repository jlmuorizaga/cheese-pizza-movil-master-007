import { Utilerias } from '../utilerias/Utilerias';
import { Categoria } from './Categoria';
import { Elemento } from './Elemento';
import { Orilla } from './Orilla';
import { Pizza } from './Pizza';

export class ElementoPizza extends Elemento {
  public override get categoriasStr(): string {
    return this.pizza.categoriasStr;
  }
  public override get esProducto(): boolean {
    return false;
  }
  public override get esPromocionValida(): boolean {
    throw new Error('Method not implemented.');
  }
  public override get mensajeDePromocionValida(): string[] {
    throw new Error('Method not implemented.');
  }
  public override get casoPrecio(): string {
    if (this.pizza.aplica2x1) {
      if (this.seCobra && this.seCobraCompleto) {
        return null as any;
      }
      if (this.seCobra && !this.seCobraCompleto) {
        return 'Precio especial por una pizza';
      }
      return 'Por 2x1';
    } else {
      return null as any;
    }
  }
  public override get precioFinal(): number {
    if (this.pizza.aplica2x1) {
      //En las pizzas el precio final depende del 2x1
      if (this.seCobra && this.seCobraCompleto) {
        return this.precioCompleto;
      }
      if (this.seCobra && !this.seCobraCompleto) {
        return this.precioPorUna;
      }
      //Si no, entonces no se cobra por el 2x1
      return 0;
    } else {
      //Si no aplica el 2x1 se cobra el precio normal siempre
      return this.precioCompleto;
    }
  }
  public override get precioFinalMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.precioFinal);
  }
  public seCobra!: boolean; //Cuando se calcula el 2x1 se determina si esta pizza se cobra o no
  public seCobraCompleto!: boolean; //Cuando no se puede hacer dos por uno se cobra el precio por una pizza

  public override get precioPorUna(): number {
    let precioConOrilla = 0;
    precioConOrilla = this.pizza.preciox1;
    if (this.pizza.orilla) {
      precioConOrilla += this.pizza.orilla.precio;
    }
    return precioConOrilla;
  }

  public override get precioCompleto(): number {
    let precioConOrilla = 0;
    precioConOrilla = this.pizza.preciox2;
    if (this.pizza.orilla) {
      precioConOrilla += this.pizza.orilla.precio;
    }
    return precioConOrilla;
  }
  public override get orillaSeleccionada(): Orilla {
    return this.pizza.orilla;
  }
  public override get esPizza(): boolean {
    return true;
  }
  public override get ordenTipo(): number {
    return 2;
  }
  public override get articulosPromo(): Categoria[] {
    return [];
  }
  public override get esPromo(): boolean {
    return false;
  }
  public override get precio(): number {
    return this.pizza.preciox2;
  }
  public override get precioMXN(): string {
    return this.pizza.preciox2MXN;
  }
  pizza!: Pizza;

  public override get descripcion(): string {
    let desc = this.pizza.descripcionStr;
    return desc;
  }
  public override get subtotal(): number {
    let subtotal = 0;
    subtotal = this.cantidad * this.precioFinal;
    return subtotal;
  }
  public override get subTotalMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.subtotal);
  }
}
