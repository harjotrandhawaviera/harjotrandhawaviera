import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailInfoDocumentComponent } from './job-detail-info-document.component';

describe('JobDetailInfoDocumentComponent', () => {
  let component: JobDetailInfoDocumentComponent;
  let fixture: ComponentFixture<JobDetailInfoDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailInfoDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailInfoDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
