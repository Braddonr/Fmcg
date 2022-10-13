import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOutletsComponent } from './view-outlets.component';

describe('ViewOutletsComponent', () => {
  let component: ViewOutletsComponent;
  let fixture: ComponentFixture<ViewOutletsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOutletsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOutletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
