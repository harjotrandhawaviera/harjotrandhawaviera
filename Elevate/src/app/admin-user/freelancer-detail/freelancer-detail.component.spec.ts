import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerDetailComponent } from './freelancer-detail.component';

describe('FreelancerDetailComponent', () => {
  let component: FreelancerDetailComponent;
  let fixture: ComponentFixture<FreelancerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
