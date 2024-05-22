import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTiemposPendientesEmpleadosComponent } from './reporte-tiempos-pendientes-empleados.component';

describe('ReporteTiemposPendientesEmpleadosComponent', () => {
  let component: ReporteTiemposPendientesEmpleadosComponent;
  let fixture: ComponentFixture<ReporteTiemposPendientesEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTiemposPendientesEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTiemposPendientesEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
