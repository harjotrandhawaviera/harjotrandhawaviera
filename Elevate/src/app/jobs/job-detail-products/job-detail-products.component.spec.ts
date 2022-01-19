import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailProductsComponent } from './job-detail-products.component';

describe('JobDetailProductsComponent', () => {
  let component: JobDetailProductsComponent;
  let fixture: ComponentFixture<JobDetailProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetailProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
