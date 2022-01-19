import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailFeedbackComponent } from './job-detail-feedback.component';

describe('JobDetailFeedbackComponent', () => {
  let component: JobDetailFeedbackComponent;
  let fixture: ComponentFixture<JobDetailFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
