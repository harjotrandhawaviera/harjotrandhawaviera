import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentEditDetailsComponent } from './deployment-edit-details.component';

describe('DeploymentEditDetailsComponent', () => {
  let component: DeploymentEditDetailsComponent;
  let fixture: ComponentFixture<DeploymentEditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentEditDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
