import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingFileListComponent } from './accounting-file-list.component';

describe('AccountingFileListComponent', () => {
  let component: AccountingFileListComponent;
  let fixture: ComponentFixture<AccountingFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountingFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
