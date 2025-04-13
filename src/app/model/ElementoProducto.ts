import { Utilerias } from '../utilerias/Utilerias';
import { Categoria } from './Categoria';
import { Elemento } from './Elemento';
import { Orilla } from './Orilla';
import { Producto } from './Producto';

export class ElementoProducto extends Elemento {
  public override get categoriasStr(): string {
    return this.producto.categoriasStr;
  }
  tieneBebidaGratis: boolean = false;
  cantidadBebidasGratis: number = 0;

  public override get esProducto(): boolean {
    return true;
  }
  public override get esPromocionValida(): boolean {
    throw new Error('Method not implemented.');
  }
  public override get mensajeDePromocionValida(): string[] {
    throw new Error('Method not implemented.');
  }
  public override get casoPrecio(): string {
    if (this.tieneBebidaGratis) {
      let beb = 'bebidas';
      if (this.cantidadBebidasGratis === 1) {
        beb = 'bebida';
      }
      return this.cantidadBebidasGratis + ' ' + beb + ' gratis';
    } else {
      return null as any;
    }
  }
  public override get precioFinal(): number {
    //En los productos el precio final es el precio completo
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
    return 3;
  }
  public override get articulosPromo(): Categoria[] {
    return [];
  }
  public override get esPromo(): boolean {
    return false;
  }
  public override get precio(): number {
    return this.producto.precio;
  }
  public override get precioMXN(): string {
    return this.producto.precioMXN;
  }
  public override get descripcion(): string {
    let desc = this.producto.descripcionStr;
    return desc;
  }
  public override get subtotal(): number {
    //Si hay bebidas gratis se debe considerar en el subtotal
    if (this.tieneBebidaGratis) {
      let cantidadACobrar: number = this.cantidad - this.cantidadBebidasGratis;
      let precioCobrar = cantidadACobrar * this.producto.precio;
      return precioCobrar;
    } else {
      return this.cantidad * this.precioFinal;
    }
  }
  public override get subTotalMXN(): string {
    return Utilerias.convierteNumeroAMoneda(this.subtotal);
  }
  producto!: Producto;
}
