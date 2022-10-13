import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotificationLabelComponent } from './edit-notification-label.component';

describe('EditNotificationLabelComponent', () => {
  let component: EditNotificationLabelComponent;
  let fixture: ComponentFixture<EditNotificationLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotificationLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotificationLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
