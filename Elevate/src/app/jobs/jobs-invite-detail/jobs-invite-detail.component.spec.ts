import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsInviteDetailComponent } from './jobs-invite-detail.component';

describe('JobsInviteDetailComponent', () => {
  let component: JobsInviteDetailComponent;
  let fixture: ComponentFixture<JobsInviteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsInviteDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsInviteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
