import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkAgreementListComponent } from './framework-agreement-list.component';

describe('FrameworkAgreementComponent', () => {
  let component: FrameworkAgreementListComponent;
  let fixture: ComponentFixture<FrameworkAgreementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameworkAgreementListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkAgreementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
