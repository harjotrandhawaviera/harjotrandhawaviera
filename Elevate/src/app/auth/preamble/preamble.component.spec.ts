import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreambleComponent } from './preamble.component';

describe('PreambleComponent', () => {
  let component: PreambleComponent;
  let fixture: ComponentFixture<PreambleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreambleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
