import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingRevenuesComponent } from './accounting-revenues.component';

describe('AccountingRevenuesComponent', () => {
  let component: AccountingRevenuesComponent;
  let fixture: ComponentFixture<AccountingRevenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingRevenuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingRevenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
