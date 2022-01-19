import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingMenuComponent } from './onboarding-menu.component';

describe('OnboardingMenuComponent', () => {
  let component: OnboardingMenuComponent;
  let fixture: ComponentFixture<OnboardingMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
