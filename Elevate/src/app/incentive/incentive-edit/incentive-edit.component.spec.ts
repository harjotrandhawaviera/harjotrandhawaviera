import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveEditComponent } from './incentive-edit.component';

describe('IncentiveEditComponent', () => {
  let component: IncentiveEditComponent;
  let fixture: ComponentFixture<IncentiveEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncentiveEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
