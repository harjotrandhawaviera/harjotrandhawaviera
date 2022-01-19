import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailReportEditComponent } from './project-detail-report-edit.component';

describe('ProjectDetailReportEditComponent', () => {
  let component: ProjectDetailReportEditComponent;
  let fixture: ComponentFixture<ProjectDetailReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailReportEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
