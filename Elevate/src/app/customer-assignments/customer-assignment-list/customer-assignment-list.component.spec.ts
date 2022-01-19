import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAssignmentListComponent } from './customer-assignment-list.component';

describe('CustomerAssignmentListComponent', () => {
  let component: CustomerAssignmentListComponent;
  let fixture: ComponentFixture<CustomerAssignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAssignmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
