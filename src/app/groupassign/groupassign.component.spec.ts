import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupassignComponent } from './groupassign.component';

describe('GroupassignComponent', () => {
  let component: GroupassignComponent;
  let fixture: ComponentFixture<GroupassignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupassignComponent]
    });
    fixture = TestBed.createComponent(GroupassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
