import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAdditionalComponent } from './invoice-additional.component';

describe('InvoiceAdditionalComponent', () => {
  let component: InvoiceAdditionalComponent;
  let fixture: ComponentFixture<InvoiceAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceAdditionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
