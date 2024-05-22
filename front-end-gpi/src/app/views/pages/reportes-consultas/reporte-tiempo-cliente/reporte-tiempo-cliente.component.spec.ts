import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTiempoClienteComponent } from './reporte-tiempo-cliente.component';

describe('ReporteTiempoClienteComponent', () => {
  let component: ReporteTiempoClienteComponent;
  let fixture: ComponentFixture<ReporteTiempoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTiempoClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTiempoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
