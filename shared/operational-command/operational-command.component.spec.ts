import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalCommandComponent } from './operational-command.component';

describe('OperationalCommandComponent', () => {
  let component: OperationalCommandComponent;
  let fixture: ComponentFixture<OperationalCommandComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OperationalCommandComponent]
    });
    fixture = TestBed.createComponent(OperationalCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
