import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerPopupComponent } from './freelancer-popup.component';

describe('FreelancerPopupComponent', () => {
  let component: FreelancerPopupComponent;
  let fixture: ComponentFixture<FreelancerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
