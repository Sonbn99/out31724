import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticInformationComponent } from './static-information.component';

describe('StaticInformationComponent', () => {
  let component: StaticInformationComponent;
  let fixture: ComponentFixture<StaticInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StaticInformationComponent]
    });
    fixture = TestBed.createComponent(StaticInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
