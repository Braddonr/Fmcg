import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoolerComponent } from './add-cooler.component';

describe('AddCoolerComponent', () => {
  let component: AddCoolerComponent;
  let fixture: ComponentFixture<AddCoolerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCoolerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCoolerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
