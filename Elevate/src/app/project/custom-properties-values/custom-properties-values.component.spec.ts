import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPropertiesValuesComponent } from './custom-properties-values.component';

describe('CustomPropertiesValuesComponent', () => {
  let component: CustomPropertiesValuesComponent;
  let fixture: ComponentFixture<CustomPropertiesValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPropertiesValuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPropertiesValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
