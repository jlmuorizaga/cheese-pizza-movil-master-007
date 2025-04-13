import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPizzasPage } from './menu-pizzas.page';

describe('MenuPizzasPage', () => {
  let component: MenuPizzasPage;
  let fixture: ComponentFixture<MenuPizzasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPizzasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
