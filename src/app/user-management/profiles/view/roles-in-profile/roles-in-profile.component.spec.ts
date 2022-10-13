import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesInProfileComponent } from './roles-in-profile.component';

describe('RolesInProfileComponent', () => {
  let component: RolesInProfileComponent;
  let fixture: ComponentFixture<RolesInProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesInProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesInProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
