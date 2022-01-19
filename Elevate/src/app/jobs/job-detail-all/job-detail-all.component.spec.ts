import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailAllComponent } from './job-detail-all.component';

describe('JobDetailComponent', () => {
  let component: JobDetailAllComponent;
  let fixture: ComponentFixture<JobDetailAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
