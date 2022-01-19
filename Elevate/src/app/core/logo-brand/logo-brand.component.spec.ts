import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoBrandComponent } from './logo-brand.component';

describe('LogoBrandComponent', () => {
  let component: LogoBrandComponent;
  let fixture: ComponentFixture<LogoBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoBrandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
