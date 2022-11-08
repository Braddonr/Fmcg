import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAddComponent } from './pending-add.component';

describe('PendingAddComponent', () => {
  let component: PendingAddComponent;
  let fixture: ComponentFixture<PendingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
