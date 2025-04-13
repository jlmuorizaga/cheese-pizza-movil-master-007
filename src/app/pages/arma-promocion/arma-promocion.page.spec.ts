import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArmaPromocionPage } from './arma-promocion.page';

describe('ArmaPromocionPage', () => {
  let component: ArmaPromocionPage;
  let fixture: ComponentFixture<ArmaPromocionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmaPromocionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
