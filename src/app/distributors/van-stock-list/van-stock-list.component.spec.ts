import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanStockListComponent } from './van-stock-list.component';

describe('VanStockListComponent', () => {
  let component: VanStockListComponent;
  let fixture: ComponentFixture<VanStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanStockListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
