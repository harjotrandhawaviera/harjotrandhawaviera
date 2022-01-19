import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceEditComponent } from './insurance-edit.component';

describe('InsuranceEditComponent', () => {
  let component: InsuranceEditComponent;
  let fixture: ComponentFixture<InsuranceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
