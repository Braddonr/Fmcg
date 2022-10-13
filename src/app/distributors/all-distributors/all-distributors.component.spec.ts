import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDistributorsComponent } from './all-distributors.component';

describe('AllDistributorsComponent', () => {
  let component: AllDistributorsComponent;
  let fixture: ComponentFixture<AllDistributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDistributorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDistributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
