import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItInfrasComponent } from './it-infras.component';

describe('ItInfrasComponent', () => {
  let component: ItInfrasComponent;
  let fixture: ComponentFixture<ItInfrasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ItInfrasComponent]
    });
    fixture = TestBed.createComponent(ItInfrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
