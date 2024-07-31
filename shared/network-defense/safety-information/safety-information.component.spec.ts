import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInformationComponent } from './safety-information.component';

describe('SafetyInformationComponent', () => {
  let component: SafetyInformationComponent;
  let fixture: ComponentFixture<SafetyInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SafetyInformationComponent]
    });
    fixture = TestBed.createComponent(SafetyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
