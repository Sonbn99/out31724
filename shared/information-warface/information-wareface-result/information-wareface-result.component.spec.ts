import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationWarefaceResultComponent } from './information-wareface-result.component';

describe('InformationWarefaceResultComponent', () => {
  let component: InformationWarefaceResultComponent;
  let fixture: ComponentFixture<InformationWarefaceResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InformationWarefaceResultComponent]
    });
    fixture = TestBed.createComponent(InformationWarefaceResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
