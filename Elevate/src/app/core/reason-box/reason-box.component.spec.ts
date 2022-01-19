import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonBoxComponent } from './reason-box.component';

describe('ReasonBoxComponent', () => {
  let component: ReasonBoxComponent;
  let fixture: ComponentFixture<ReasonBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
