import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingEditDetailsComponent } from './accounting-edit-details.component';

describe('AccountingEditDetailsComponent', () => {
  let component: AccountingEditDetailsComponent;
  let fixture: ComponentFixture<AccountingEditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingEditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
