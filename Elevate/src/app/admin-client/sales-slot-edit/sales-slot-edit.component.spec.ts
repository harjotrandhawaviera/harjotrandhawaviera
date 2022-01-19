import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSlotEditComponent } from './sales-slot-edit.component';

describe('SalesSlotEditComponent', () => {
  let component: SalesSlotEditComponent;
  let fixture: ComponentFixture<SalesSlotEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesSlotEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesSlotEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
