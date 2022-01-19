import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePreparationComponent } from './invoice-preparation.component';

describe('InvoicePreparationComponent', () => {
  let component: InvoicePreparationComponent;
  let fixture: ComponentFixture<InvoicePreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
