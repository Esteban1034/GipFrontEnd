import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarTiempoComponent } from './aprobar-tiempo.component';

describe('AprobarTiempoComponent', () => {
  let component: AprobarTiempoComponent;
  let fixture: ComponentFixture<AprobarTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobarTiempoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
