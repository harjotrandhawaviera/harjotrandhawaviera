import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkAgreementEditComponent } from './framework-agreement-edit.component';

describe('FrameworkAgreementEditComponent', () => {
  let component: FrameworkAgreementEditComponent;
  let fixture: ComponentFixture<FrameworkAgreementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameworkAgreementEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkAgreementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
