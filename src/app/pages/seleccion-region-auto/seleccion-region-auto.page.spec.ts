import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionRegionAutoPage } from './seleccion-region-auto.page';

describe('SeleccionRegionAutoPage', () => {
  let component: SeleccionRegionAutoPage;
  let fixture: ComponentFixture<SeleccionRegionAutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionRegionAutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
