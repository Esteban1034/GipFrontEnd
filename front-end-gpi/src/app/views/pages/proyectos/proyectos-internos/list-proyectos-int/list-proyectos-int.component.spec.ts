import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProyectosIntComponent } from './list-proyectos-int.component';

describe('ListProyectosIntComponent', () => {
  let component: ListProyectosIntComponent;
  let fixture: ComponentFixture<ListProyectosIntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProyectosIntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProyectosIntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
