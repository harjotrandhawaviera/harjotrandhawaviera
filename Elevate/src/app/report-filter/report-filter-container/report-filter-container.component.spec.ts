import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFilterContainerComponent } from './report-filter-container.component';

describe('ReportFilterContainerComponent', () => {
  let component: ReportFilterContainerComponent;
  let fixture: ComponentFixture<ReportFilterContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFilterContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFilterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
