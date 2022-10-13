import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVanStockComponent } from './add-van-stock.component';

describe('AddVanStockComponent', () => {
  let component: AddVanStockComponent;
  let fixture: ComponentFixture<AddVanStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVanStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVanStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
