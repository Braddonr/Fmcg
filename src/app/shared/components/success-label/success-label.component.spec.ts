import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessLabelComponent } from './success-label.component';

describe('SuccessLabelComponent', () => {
  let component: SuccessLabelComponent;
  let fixture: ComponentFixture<SuccessLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
