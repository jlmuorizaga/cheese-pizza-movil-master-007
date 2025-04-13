import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditaDatosClientePage } from './edita-datos-cliente.page';

describe('EditaDatosClientePage', () => {
  let component: EditaDatosClientePage;
  let fixture: ComponentFixture<EditaDatosClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaDatosClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
