import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceReviewRatingComponent } from './performance-review-rating.component';

describe('PerformanceReviewRatingComponent', () => {
  let component: PerformanceReviewRatingComponent;
  let fixture: ComponentFixture<PerformanceReviewRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceReviewRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
