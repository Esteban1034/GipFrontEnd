import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorasReportadasComponent } from './horas-reportadas.component';

describe('HorasReportadasComponent', () => {
  let component: HorasReportadasComponent;
  let fixture: ComponentFixture<HorasReportadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorasReportadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorasReportadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
