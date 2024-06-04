import { ComponentFixture, TestBed } from '@angular/core/testing';
import { crear_estimacion } from './crear-estimacion.component';


describe('EstimacionesComponent', () => {
  let component: crear_estimacion;
  let fixture: ComponentFixture<crear_estimacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ crear_estimacion ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(crear_estimacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
