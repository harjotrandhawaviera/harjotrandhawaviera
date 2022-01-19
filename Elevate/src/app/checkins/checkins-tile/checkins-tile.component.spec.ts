import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckinsTileComponent } from './checkins-tile.component';

describe('CheckinsTileComponent', () => {
  let component: CheckinsTileComponent;
  let fixture: ComponentFixture<CheckinsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckinsTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckinsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
