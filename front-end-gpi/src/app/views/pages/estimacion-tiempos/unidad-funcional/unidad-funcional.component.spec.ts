import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnidadFuncionalComponent } from './unidad-funcional.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UnidadFuncionalComponent', () => {
  let component: UnidadFuncionalComponent;
  let fixture: ComponentFixture<UnidadFuncionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadFuncionalComponent ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ ContenidoUfsService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadFuncionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with the required fields', () => {
    const form = component.contenidoUfsForm;
    expect(form.contains('nombreCaso')).toBeTruthy();
    expect(form.contains('porcentajeConstruccion')).toBeTruthy();
    expect(form.contains('porcentajeDiseno')).toBeTruthy();
    expect(form.contains('porcentajePruebas')).toBeTruthy();
    expect(form.contains('totalConstruccion')).toBeTruthy();
    expect(form.contains('totalDiseno')).toBeTruthy();
    expect(form.contains('totalPruebas')).toBeTruthy();
    expect(form.contains('fkEsfuerzo')).toBeTruthy();
    expect(form.contains('fkFuncion')).toBeTruthy();
    expect(form.contains('fkMantenimientoUnidad')).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    const form = component.contenidoUfsForm;
    expect(form.valid).toBeFalsy();
  });

  it('should make the name field required', () => {
    const form = component.contenidoUfsForm;
    const nombreCasoControl = form.get('nombreCaso');
    nombreCasoControl.setValue('');
    expect(nombreCasoControl.valid).toBeFalsy();
  });

  // Add more tests as needed
});
