import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DutyRosterComponent } from './duty-roster.component';

describe('DutyRosterComponent', () => {
  let component: DutyRosterComponent;
  let fixture: ComponentFixture<DutyRosterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DutyRosterComponent]
    });
    fixture = TestBed.createComponent(DutyRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
