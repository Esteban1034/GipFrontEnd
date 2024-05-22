import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAprobarTiempoComponent } from './detalle-aprobar-tiempo.component';

describe('DetalleAprobarTiempoComponent', () => {
  let component: DetalleAprobarTiempoComponent;
  let fixture: ComponentFixture<DetalleAprobarTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleAprobarTiempoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAprobarTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
