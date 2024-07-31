import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInformationAlertComponent } from './safety-information-alert.component';

describe('SafetyInformationAlertComponent', () => {
  let component: SafetyInformationAlertComponent;
  let fixture: ComponentFixture<SafetyInformationAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafetyInformationAlertComponent]
    });
    fixture = TestBed.createComponent(SafetyInformationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
