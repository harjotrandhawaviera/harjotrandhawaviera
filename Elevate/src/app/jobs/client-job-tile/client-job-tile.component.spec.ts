import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobTileComponent } from './client-job-tile.component';

describe('ClientJobTileComponent', () => {
  let component: ClientJobTileComponent;
  let fixture: ComponentFixture<ClientJobTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientJobTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientJobTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
