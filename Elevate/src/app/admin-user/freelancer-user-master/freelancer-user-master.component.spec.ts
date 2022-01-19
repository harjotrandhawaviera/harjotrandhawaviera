import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerUserMasterComponent } from './freelancer-user-master.component';

describe('FreelancerUserMasterComponent', () => {
  let component: FreelancerUserMasterComponent;
  let fixture: ComponentFixture<FreelancerUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerUserMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
