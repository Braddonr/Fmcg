import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HqCdPriceComponent } from './hq-cd-price.component';

describe('HqCdPriceComponent', () => {
  let component: HqCdPriceComponent;
  let fixture: ComponentFixture<HqCdPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HqCdPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HqCdPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
