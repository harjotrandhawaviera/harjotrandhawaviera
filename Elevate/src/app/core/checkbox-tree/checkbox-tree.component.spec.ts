import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxTreeComponent } from './checkbox-tree.component';

xdescribe('CheckboxTreeComponent', () => {
  let component: CheckboxTreeComponent;
  let fixture: ComponentFixture<CheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
