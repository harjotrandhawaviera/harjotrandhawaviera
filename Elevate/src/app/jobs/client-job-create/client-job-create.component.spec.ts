import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientJobCreateComponent } from './client-job-create.component';

describe('ClientJobCreateComponent', () => {
  let component: ClientJobCreateComponent;
  let fixture: ComponentFixture<ClientJobCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientJobCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientJobCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
