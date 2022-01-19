import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveDetailsComponent } from './incentive-details.component';

describe('IncentiveDetailsComponent', () => {
  let component: IncentiveDetailsComponent;
  let fixture: ComponentFixture<IncentiveDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
