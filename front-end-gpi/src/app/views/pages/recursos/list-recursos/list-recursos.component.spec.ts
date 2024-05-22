import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecursosComponent } from './list-recursos.component';

describe('ListRecursosComponent', () => {
  let component: ListRecursosComponent;
  let fixture: ComponentFixture<ListRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRecursosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
