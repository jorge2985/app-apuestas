import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApuestasUsuarioPage } from './apuestas-usuario.page';

describe('ApuestasUsuarioPage', () => {
  let component: ApuestasUsuarioPage;
  let fixture: ComponentFixture<ApuestasUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuestasUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
