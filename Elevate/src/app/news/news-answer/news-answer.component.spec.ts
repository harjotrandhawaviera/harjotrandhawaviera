import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsAnswerComponent } from './news-answer.component';

describe('NewsAnswerComponent', () => {
  let component: NewsAnswerComponent;
  let fixture: ComponentFixture<NewsAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
