import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInviteComponent } from './job-invite.component';

describe('JobInviteComponent', () => {
  let component: JobInviteComponent;
  let fixture: ComponentFixture<JobInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
