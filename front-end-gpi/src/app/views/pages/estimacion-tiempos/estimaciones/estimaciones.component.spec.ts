import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estimaciones_Iseries } from './estimaciones.component';


describe('EstimacionesComponent', () => {
  let component: Estimaciones_Iseries;
  let fixture: ComponentFixture<Estimaciones_Iseries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estimaciones_Iseries ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estimaciones_Iseries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
