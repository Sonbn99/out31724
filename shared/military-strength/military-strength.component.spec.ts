import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryStrengthComponent } from './military-strength.component';

describe('MilitaryStrengthComponent', () => {
  let component: MilitaryStrengthComponent;
  let fixture: ComponentFixture<MilitaryStrengthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MilitaryStrengthComponent]
    });
    fixture = TestBed.createComponent(MilitaryStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
