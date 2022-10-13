import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutletPriceComponent } from './add-outlet-price.component';

describe('AddOutletPriceComponent', () => {
  let component: AddOutletPriceComponent;
  let fixture: ComponentFixture<AddOutletPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutletPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutletPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
