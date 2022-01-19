import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerAssignmentDetailsComponent } from './freelancer-assignment-details.component';

describe('FreelancerAssignmentDetailsComponent', () => {
  let component: FreelancerAssignmentDetailsComponent;
  let fixture: ComponentFixture<FreelancerAssignmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerAssignmentDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerAssignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
