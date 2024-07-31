import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarfaceTechniqueComponent } from './warface-technique.component';

describe('WarfaceTechniqueComponent', () => {
  let component: WarfaceTechniqueComponent;
  let fixture: ComponentFixture<WarfaceTechniqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WarfaceTechniqueComponent]
    });
    fixture = TestBed.createComponent(WarfaceTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
