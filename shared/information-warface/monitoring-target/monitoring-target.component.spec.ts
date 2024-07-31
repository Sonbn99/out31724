import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTargetComponent } from './monitoring-target.component';

describe('MonitoringTargetComponent', () => {
  let component: MonitoringTargetComponent;
  let fixture: ComponentFixture<MonitoringTargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MonitoringTargetComponent]
    });
    fixture = TestBed.createComponent(MonitoringTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
