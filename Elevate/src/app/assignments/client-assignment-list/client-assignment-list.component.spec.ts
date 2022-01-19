import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAssignmentListComponent } from './client-assignment-list.component';

describe('ClientAssignmentListComponent', () => {
  let component: ClientAssignmentListComponent;
  let fixture: ComponentFixture<ClientAssignmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAssignmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
