import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFacturacionClienteComponent } from './reporte-facturacion-cliente.component';

describe('ReporteFacturacionClienteComponent', () => {
  let component: ReporteFacturacionClienteComponent;
  let fixture: ComponentFixture<ReporteFacturacionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteFacturacionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteFacturacionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
