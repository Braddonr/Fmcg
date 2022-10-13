import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStatusLabelComponent } from './active-status-label.component';

describe('ActiveStatusLabelComponent', () => {
  let component: ActiveStatusLabelComponent;
  let fixture: ComponentFixture<ActiveStatusLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveStatusLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveStatusLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
