import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyCardComponent } from './topology-card.component';

describe('TopologyCardComponent', () => {
  let component: TopologyCardComponent;
  let fixture: ComponentFixture<TopologyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopologyCardComponent]
    });
    fixture = TestBed.createComponent(TopologyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
