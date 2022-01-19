import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailSummaryComponent } from './project-detail-summary.component';

describe('ProjectDetailSummaryComponent', () => {
  let component: ProjectDetailSummaryComponent;
  let fixture: ComponentFixture<ProjectDetailSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
