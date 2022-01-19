import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSlotsComponent } from './sales-slots.component';

describe('SalesSlotsComponent', () => {
  let component: SalesSlotsComponent;
  let fixture: ComponentFixture<SalesSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesSlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
