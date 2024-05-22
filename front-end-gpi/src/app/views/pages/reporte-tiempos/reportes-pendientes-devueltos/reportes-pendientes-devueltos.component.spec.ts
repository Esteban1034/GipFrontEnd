import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPendientesDevueltosComponent } from './reportes-pendientes-devueltos.component';

describe('ReportesPendientesDevueltosComponent', () => {
  let component: ReportesPendientesDevueltosComponent;
  let fixture: ComponentFixture<ReportesPendientesDevueltosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesPendientesDevueltosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesPendientesDevueltosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
