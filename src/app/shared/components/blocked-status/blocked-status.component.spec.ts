import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedStatusComponent } from './blocked-status.component';

describe('BlockedStatusComponent', () => {
  let component: BlockedStatusComponent;
  let fixture: ComponentFixture<BlockedStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockedStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
