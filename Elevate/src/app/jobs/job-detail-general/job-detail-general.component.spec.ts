import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailGeneralComponent } from './job-detail-general.component';

describe('JobDetailGeneralComponent', () => {
  let component: JobDetailGeneralComponent;
  let fixture: ComponentFixture<JobDetailGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
