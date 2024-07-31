import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDetailModalComponent } from './device-detail-modal.component';

describe('DeviceDetailModalComponent', () => {
  let component: DeviceDetailModalComponent;
  let fixture: ComponentFixture<DeviceDetailModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceDetailModalComponent]
    });
    fixture = TestBed.createComponent(DeviceDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
