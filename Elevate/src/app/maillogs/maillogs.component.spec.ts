import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaillogsComponent } from './maillogs.component';

describe('MaillogsComponent', () => {
  let component: MaillogsComponent;
  let fixture: ComponentFixture<MaillogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaillogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaillogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
