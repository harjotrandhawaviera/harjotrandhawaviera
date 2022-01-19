import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPropertiesValueComponent } from './custom-properties-value.component';

describe('CustomPropertiesValueComponent', () => {
  let component: CustomPropertiesValueComponent;
  let fixture: ComponentFixture<CustomPropertiesValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomPropertiesValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPropertiesValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
