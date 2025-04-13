import { Categoria } from './Categoria';
import { Orilla } from './Orilla';

export abstract class Elemento {
  cantidad!: number;
  eliminar!: boolean;
  contabilizadaPromo: boolean = false;
  cantidadContabilizadaPromo = 1;

  public aumentar() {
    this.cantidad++;
  }

  public disminuir() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  public abstract get categoriasStr(): string;

  public abstract get esPromocionValida(): boolean;
  public abstract get mensajeDePromocionValida(): string[];

  public abstract get descripcion(): string;
  public abstract get precio(): number;
  public abstract get precioCompleto(): number;
  public abstract get precioPorUna(): number;
  public abstract get precioFinal(): number;
  public abstract get precioFinalMXN(): string;
  public abstract get casoPrecio(): string;

  public abstract get precioMXN(): string;
  public abstract get subtotal(): number;
  public abstract get subTotalMXN(): string;

  public abstract get esPromo(): boolean;
  public abstract get articulosPromo(): Categoria[];
  public abstract get esPizza(): boolean;
  public abstract get esProducto(): boolean;

  public abstract get orillaSeleccionada(): Orilla;
  public abstract get ordenTipo(): number;
}
