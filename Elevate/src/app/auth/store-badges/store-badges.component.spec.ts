import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBadgesComponent } from './store-badges.component';

describe('StoreBadgesComponent', () => {
  let component: StoreBadgesComponent;
  let fixture: ComponentFixture<StoreBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreBadgesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
