import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPizzasSeleccionPage } from './menu-pizzas-seleccion.page';

describe('MenuPizzasSeleccionPage', () => {
  let component: MenuPizzasSeleccionPage;
  let fixture: ComponentFixture<MenuPizzasSeleccionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPizzasSeleccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
