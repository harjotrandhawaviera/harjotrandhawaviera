import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalNewFreelancerComponent } from './approval-new-freelancer.component';

describe('ApprovalNewFreelancerComponent', () => {
  let component: ApprovalNewFreelancerComponent;
  let fixture: ComponentFixture<ApprovalNewFreelancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalNewFreelancerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalNewFreelancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
