import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailGeneralEditComponent } from './project-detail-general-edit.component';

describe('ProjectDetailGeneralEditComponent', () => {
  let component: ProjectDetailGeneralEditComponent;
  let fixture: ComponentFixture<ProjectDetailGeneralEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailGeneralEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailGeneralEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
