import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerEducationComponent } from './freelancer-education.component';

describe('FreelancerEducationComponent', () => {
  let component: FreelancerEducationComponent;
  let fixture: ComponentFixture<FreelancerEducationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerEducationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerEducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
