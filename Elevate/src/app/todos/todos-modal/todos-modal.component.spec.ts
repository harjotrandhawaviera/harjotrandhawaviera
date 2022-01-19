import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosModalComponent } from './todos-modal.component';

describe('TodosModalComponent', () => {
  let component: TodosModalComponent;
  let fixture: ComponentFixture<TodosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
