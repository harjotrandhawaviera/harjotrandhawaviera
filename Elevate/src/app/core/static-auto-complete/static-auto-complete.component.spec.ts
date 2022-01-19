import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticAutoCompleteComponent } from './static-auto-complete.component';

describe('StaticAutoCompleteComponent', () => {
  let component: StaticAutoCompleteComponent;
  let fixture: ComponentFixture<StaticAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticAutoCompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
