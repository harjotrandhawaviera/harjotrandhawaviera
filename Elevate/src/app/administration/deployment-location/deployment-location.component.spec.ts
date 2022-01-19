import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentLocationComponent } from './deployment-location.component';

describe('DeploymentLoactionComponent', () => {
  let component: DeploymentLocationComponent;
  let fixture: ComponentFixture<DeploymentLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
