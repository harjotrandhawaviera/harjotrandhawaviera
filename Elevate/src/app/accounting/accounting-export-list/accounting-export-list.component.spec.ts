import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingExportListComponent } from './accounting-export-list.component';

describe('AccountingExportListComponent', () => {
  let component: AccountingExportListComponent;
  let fixture: ComponentFixture<AccountingExportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingExportListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingExportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
