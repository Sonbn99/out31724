import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuanceInforComponent } from './nuance-infor.component';

describe('NuanceInforComponent', () => {
  let component: NuanceInforComponent;
  let fixture: ComponentFixture<NuanceInforComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NuanceInforComponent]
    });
    fixture = TestBed.createComponent(NuanceInforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
