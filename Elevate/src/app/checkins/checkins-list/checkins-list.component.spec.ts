import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinsListComponent } from './checkins-list.component';

describe('CheckinsListComponent', () => {
  let component: CheckinsListComponent;
  let fixture: ComponentFixture<CheckinsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
