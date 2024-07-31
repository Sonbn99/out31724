import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectingTargetComponent } from './protecting-target.component';

describe('ProtectingTargetComponent', () => {
  let component: ProtectingTargetComponent;
  let fixture: ComponentFixture<ProtectingTargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProtectingTargetComponent]
    });
    fixture = TestBed.createComponent(ProtectingTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
