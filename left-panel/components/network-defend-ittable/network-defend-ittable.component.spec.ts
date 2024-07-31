import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDefendITTableComponent } from './network-defend-ittable.component';

describe('NetworkDefendITTableComponent', () => {
  let component: NetworkDefendITTableComponent;
  let fixture: ComponentFixture<NetworkDefendITTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NetworkDefendITTableComponent]
    });
    fixture = TestBed.createComponent(NetworkDefendITTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
