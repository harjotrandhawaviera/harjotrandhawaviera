import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectAutoCompleteComponent } from './multi-select-auto-complete.component';

describe('MultiSelectAutoCompleteComponent', () => {
  let component: MultiSelectAutoCompleteComponent;
  let fixture: ComponentFixture<MultiSelectAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectAutoCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
