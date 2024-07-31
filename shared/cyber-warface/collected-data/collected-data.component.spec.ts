import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedDataComponent } from './collected-data.component';

describe('CollectedDataComponent', () => {
  let component: CollectedDataComponent;
  let fixture: ComponentFixture<CollectedDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CollectedDataComponent]
    });
    fixture = TestBed.createComponent(CollectedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
