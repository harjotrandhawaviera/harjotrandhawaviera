import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailGeneralEditComponent } from './job-detail-general-edit.component';

describe('JobDetailGeneralEditComponent', () => {
  let component: JobDetailGeneralEditComponent;
  let fixture: ComponentFixture<JobDetailGeneralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailGeneralEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailGeneralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
