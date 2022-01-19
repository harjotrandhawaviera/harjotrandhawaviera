import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentJobFeedbackComponent } from './assignment-job-feedback.component';

describe('AssignmentJobFeedbackComponent', () => {
  let component: AssignmentJobFeedbackComponent;
  let fixture: ComponentFixture<AssignmentJobFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentJobFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentJobFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
