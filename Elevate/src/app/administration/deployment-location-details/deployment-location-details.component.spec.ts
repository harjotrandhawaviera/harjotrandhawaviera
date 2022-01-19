import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentLocationDetailsComponent } from './deployment-location-details.component';

describe('DeploymentLoactionDetailsComponent', () => {
  let component: DeploymentLocationDetailsComponent;
  let fixture: ComponentFixture<DeploymentLocationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentLocationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentLocationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
