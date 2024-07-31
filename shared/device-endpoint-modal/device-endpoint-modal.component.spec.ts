import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEndpointModalComponent } from './device-endpoint-modal.component';

describe('DeviceEndpointModalComponent', () => {
  let component: DeviceEndpointModalComponent;
  let fixture: ComponentFixture<DeviceEndpointModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceEndpointModalComponent]
    });
    fixture = TestBed.createComponent(DeviceEndpointModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
