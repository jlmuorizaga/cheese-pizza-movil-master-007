import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeleccionRegionManualPage } from './seleccion-region-manual.page';

describe('SeleccionRegionManualPage', () => {
  let component: SeleccionRegionManualPage;
  let fixture: ComponentFixture<SeleccionRegionManualPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionRegionManualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
