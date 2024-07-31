import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsStatusComponent } from './weapons-status.component';

describe('WeaponsStatusComponent', () => {
  let component: WeaponsStatusComponent;
  let fixture: ComponentFixture<WeaponsStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WeaponsStatusComponent]
    });
    fixture = TestBed.createComponent(WeaponsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
