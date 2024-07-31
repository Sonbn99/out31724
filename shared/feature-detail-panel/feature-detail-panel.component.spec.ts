import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureDetailPanelComponent } from './feature-detail-panel.component';

describe('FeatureDetailPanelComponent', () => {
  let component: FeatureDetailPanelComponent;
  let fixture: ComponentFixture<FeatureDetailPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeatureDetailPanelComponent]
    });
    fixture = TestBed.createComponent(FeatureDetailPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
