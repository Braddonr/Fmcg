import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWorflowComponent } from './view-worflow.component';

describe('ViewWorflowComponent', () => {
  let component: ViewWorflowComponent;
  let fixture: ComponentFixture<ViewWorflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWorflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
