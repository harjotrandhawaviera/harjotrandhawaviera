import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterListComponent } from './report-filter-list.component';

describe('ReportFilterListComponent', () => {
  let component: ReportFilterListComponent;
  let fixture: ComponentFixture<ReportFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFilterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
