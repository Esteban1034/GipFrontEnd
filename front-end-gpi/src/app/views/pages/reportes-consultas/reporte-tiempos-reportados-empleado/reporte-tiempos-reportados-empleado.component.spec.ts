import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTiemposReportadosEmpleadoComponent } from './reporte-tiempos-reportados-empleado.component';

describe('ReporteTiemposReportadosEmpleadoComponent', () => {
  let component: ReporteTiemposReportadosEmpleadoComponent;
  let fixture: ComponentFixture<ReporteTiemposReportadosEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTiemposReportadosEmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTiemposReportadosEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
