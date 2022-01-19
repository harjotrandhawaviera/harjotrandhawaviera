import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentRatingsComponent } from './assignment-ratings.component';

describe('AssignmentRatingsComponent', () => {
  let component: AssignmentRatingsComponent;
  let fixture: ComponentFixture<AssignmentRatingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentRatingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
