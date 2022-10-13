import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedLabelComponent } from './blocked-label.component';

describe('BlockedLabelComponent', () => {
  let component: BlockedLabelComponent;
  let fixture: ComponentFixture<BlockedLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockedLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
