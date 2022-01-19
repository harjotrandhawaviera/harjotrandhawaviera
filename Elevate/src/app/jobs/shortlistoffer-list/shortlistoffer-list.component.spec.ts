import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistofferListComponent } from './shortlistoffer-list.component';

describe('ShortlistofferListComponent', () => {
  let component: ShortlistofferListComponent;
  let fixture: ComponentFixture<ShortlistofferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortlistofferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistofferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
