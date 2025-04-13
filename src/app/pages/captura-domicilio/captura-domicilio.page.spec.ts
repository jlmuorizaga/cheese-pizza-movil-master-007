import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturaDomicilioPage } from './captura-domicilio.page';

describe('CapturaDomicilioPage', () => {
  let component: CapturaDomicilioPage;
  let fixture: ComponentFixture<CapturaDomicilioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturaDomicilioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
