import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletPriceListComponent } from './outlet-price-list.component';

describe('OutletPriceListComponent', () => {
  let component: OutletPriceListComponent;
  let fixture: ComponentFixture<OutletPriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutletPriceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
