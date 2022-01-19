import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentJobInfoDocumentComponent } from './assignment-job-info-document.component';

describe('AssignmentJobInfoDocumentComponent', () => {
  let component: AssignmentJobInfoDocumentComponent;
  let fixture: ComponentFixture<AssignmentJobInfoDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentJobInfoDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentJobInfoDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
