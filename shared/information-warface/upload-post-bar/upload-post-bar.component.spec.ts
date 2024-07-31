import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPostBarComponent } from './upload-post-bar.component';

describe('UploadPostBarComponent', () => {
  let component: UploadPostBarComponent;
  let fixture: ComponentFixture<UploadPostBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadPostBarComponent]
    });
    fixture = TestBed.createComponent(UploadPostBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
