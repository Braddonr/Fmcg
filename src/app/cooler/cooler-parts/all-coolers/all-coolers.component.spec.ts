import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCoolersComponent } from './all-coolers.component';

describe('AllCoolersComponent', () => {
  let component: AllCoolersComponent;
  let fixture: ComponentFixture<AllCoolersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCoolersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCoolersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
