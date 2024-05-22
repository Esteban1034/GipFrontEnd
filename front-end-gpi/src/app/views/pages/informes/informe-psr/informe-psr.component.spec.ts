import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformePsrComponent } from './informe-psr.component';

describe('InformePsrComponent', () => {
  let component: InformePsrComponent;
  let fixture: ComponentFixture<InformePsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformePsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformePsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
