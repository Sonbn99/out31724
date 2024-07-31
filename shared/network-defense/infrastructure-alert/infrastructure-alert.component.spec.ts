import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureAlertComponent } from './infrastructure-alert.component';

describe('InfrastructureAlertComponent', () => {
  let component: InfrastructureAlertComponent;
  let fixture: ComponentFixture<InfrastructureAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureAlertComponent]
    });
    fixture = TestBed.createComponent(InfrastructureAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
