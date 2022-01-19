import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadHtmlComponent } from './load-html.component';

describe('LoadHtmlComponent', () => {
  let component: LoadHtmlComponent;
  let fixture: ComponentFixture<LoadHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
