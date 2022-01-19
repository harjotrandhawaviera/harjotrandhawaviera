import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignmentTileComponent } from './client-assignment-tile.component';

describe('ClientAssignmentTileComponent', () => {
  let component: ClientAssignmentTileComponent;
  let fixture: ComponentFixture<ClientAssignmentTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAssignmentTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignmentTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
