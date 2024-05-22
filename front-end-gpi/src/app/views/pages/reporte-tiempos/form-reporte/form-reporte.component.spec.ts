import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReporteComponent } from './form-reporte.component';

describe('FormReporteComponent', () => {
  let component: FormReporteComponent;
  let fixture: ComponentFixture<FormReporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormReporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
