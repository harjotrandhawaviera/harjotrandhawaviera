import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendersTileComponent } from './tenders-tile.component';

describe('TendersTileComponent', () => {
  let component: TendersTileComponent;
  let fixture: ComponentFixture<TendersTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TendersTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TendersTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
