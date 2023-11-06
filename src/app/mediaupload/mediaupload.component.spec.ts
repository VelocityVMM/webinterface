import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediauploadComponent } from './mediaupload.component';

describe('MediauploadComponent', () => {
  let component: MediauploadComponent;
  let fixture: ComponentFixture<MediauploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediauploadComponent]
    });
    fixture = TestBed.createComponent(MediauploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
