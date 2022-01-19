import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTendersCreateComponent } from './job-tenders-create.component';

describe('JobTendersCreateComponent', () => {
  let component: JobTendersCreateComponent;
  let fixture: ComponentFixture<JobTendersCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTendersCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTendersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
