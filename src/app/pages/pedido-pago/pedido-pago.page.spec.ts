import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoPagoPage } from './pedido-pago.page';

describe('PedidoPagoPage', () => {
  let component: PedidoPagoPage;
  let fixture: ComponentFixture<PedidoPagoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
