import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProyectoIntComponent } from './form-proyecto-int.component';

describe('FormProyectoIntComponent', () => {
  let component: FormProyectoIntComponent;
  let fixture: ComponentFixture<FormProyectoIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProyectoIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProyectoIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
