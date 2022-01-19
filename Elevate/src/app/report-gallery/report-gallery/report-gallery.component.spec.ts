import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGalleryComponent } from './report-gallery.component';

describe('ReportGalleryComponent', () => {
  let component: ReportGalleryComponent;
  let fixture: ComponentFixture<ReportGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
