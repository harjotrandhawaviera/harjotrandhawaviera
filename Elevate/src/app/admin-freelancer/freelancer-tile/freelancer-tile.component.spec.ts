import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerTileComponent } from './freelancer-tile.component';

describe('FreelancerTileComponent', () => {
  let component: FreelancerTileComponent;
  let fixture: ComponentFixture<FreelancerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreelancerTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
