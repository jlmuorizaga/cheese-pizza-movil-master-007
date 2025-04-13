import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuProductosTiposPage } from './menu-productos-tipos.page';

describe('MenuProductosTiposPage', () => {
  let component: MenuProductosTiposPage;
  let fixture: ComponentFixture<MenuProductosTiposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuProductosTiposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
