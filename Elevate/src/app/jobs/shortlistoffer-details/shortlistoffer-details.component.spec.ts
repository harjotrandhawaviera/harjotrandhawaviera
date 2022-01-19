import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistofferDetailsComponent } from './shortlistoffer-details.component';

describe('ShortlistofferDetailsComponent', () => {
  let component: ShortlistofferDetailsComponent;
  let fixture: ComponentFixture<ShortlistofferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortlistofferDetailsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistofferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
