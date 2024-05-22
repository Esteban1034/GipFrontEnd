import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProyectoIntComponent } from './update-proyecto-int.component';

describe('UpdateProyectoIntComponent', () => {
  let component: UpdateProyectoIntComponent;
  let fixture: ComponentFixture<UpdateProyectoIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProyectoIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProyectoIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
