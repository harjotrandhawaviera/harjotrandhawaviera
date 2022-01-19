import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentJobGeneralComponent } from './assignment-job-general.component';

describe('AssignmentJobGeneralComponent', () => {
  let component: AssignmentJobGeneralComponent;
  let fixture: ComponentFixture<AssignmentJobGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentJobGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentJobGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
