import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuPromocionesPage } from './menu-promociones.page';

describe('MenuPromocionesPage', () => {
  let component: MenuPromocionesPage;
  let fixture: ComponentFixture<MenuPromocionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuPromocionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
