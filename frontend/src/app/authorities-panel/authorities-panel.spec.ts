import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthoritiesPanel } from './authorities-panel';

describe('AuthoritiesPanel', () => {
  let component: AuthoritiesPanel;
  let fixture: ComponentFixture<AuthoritiesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthoritiesPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthoritiesPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
