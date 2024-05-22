import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPsrComponent } from './crear-psr.component';

describe('CrearPsrComponent', () => {
  let component: CrearPsrComponent;
  let fixture: ComponentFixture<CrearPsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
