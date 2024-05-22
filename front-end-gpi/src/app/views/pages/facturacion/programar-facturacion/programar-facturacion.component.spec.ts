import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramarFacturacionComponent } from './programar-facturacion.component';

describe('ProgramarFacturacionComponent', () => {
  let component: ProgramarFacturacionComponent;
  let fixture: ComponentFixture<ProgramarFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramarFacturacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramarFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
