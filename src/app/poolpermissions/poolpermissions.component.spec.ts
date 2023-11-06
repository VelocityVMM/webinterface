import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolpermissionsComponent } from './poolpermissions.component';

describe('PoolpermissionsComponent', () => {
  let component: PoolpermissionsComponent;
  let fixture: ComponentFixture<PoolpermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoolpermissionsComponent]
    });
    fixture = TestBed.createComponent(PoolpermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
