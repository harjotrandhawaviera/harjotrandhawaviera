import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailGeneralComponent } from './project-detail-general.component';

describe('ProjectDetailGeneralComponent', () => {
  let component: ProjectDetailGeneralComponent;
  let fixture: ComponentFixture<ProjectDetailGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDetailGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
