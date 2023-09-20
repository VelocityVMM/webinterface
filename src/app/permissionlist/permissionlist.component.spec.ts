import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionlistComponent } from './permissionlist.component';

describe('PermissionlistComponent', () => {
  let component: PermissionlistComponent;
  let fixture: ComponentFixture<PermissionlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionlistComponent]
    });
    fixture = TestBed.createComponent(PermissionlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
