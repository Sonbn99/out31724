import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotTopicComponent } from './hot-topic.component';

describe('HotTopicComponent', () => {
  let component: HotTopicComponent;
  let fixture: ComponentFixture<HotTopicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotTopicComponent]
    });
    fixture = TestBed.createComponent(HotTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
