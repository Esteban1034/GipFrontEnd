import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProyectoRecursoComponent } from './reporte-proyecto-recurso.component';

describe('ReporteProyectoRecursoComponent', () => {
  let component: ReporteProyectoRecursoComponent;
  let fixture: ComponentFixture<ReporteProyectoRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteProyectoRecursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteProyectoRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
