import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendersListComponent } from './tenders-list.component';

describe('TendersListComponent', () => {
  let component: TendersListComponent;
  let fixture: ComponentFixture<TendersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TendersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TendersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
