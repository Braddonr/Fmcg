import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletsListComponent } from './outlets-list.component';

describe('OutletsListComponent', () => {
  let component: OutletsListComponent;
  let fixture: ComponentFixture<OutletsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
