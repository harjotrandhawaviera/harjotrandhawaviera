import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyLinkConfirmationComponent } from './survey-link-confirmation.component';

describe('SurveyLinkConfirmationComponent', () => {
  let component: SurveyLinkConfirmationComponent;
  let fixture: ComponentFixture<SurveyLinkConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyLinkConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyLinkConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
