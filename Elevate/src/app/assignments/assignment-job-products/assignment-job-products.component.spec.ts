import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentJobProductsComponent } from './assignment-job-products.component';

describe('AssignmentJobProductsComponent', () => {
  let component: AssignmentJobProductsComponent;
  let fixture: ComponentFixture<AssignmentJobProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignmentJobProductsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentJobProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
