import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatReadinessComponent } from './combat-readiness.component';

describe('CombatReadinessComponent', () => {
  let component: CombatReadinessComponent;
  let fixture: ComponentFixture<CombatReadinessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CombatReadinessComponent]
    });
    fixture = TestBed.createComponent(CombatReadinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
