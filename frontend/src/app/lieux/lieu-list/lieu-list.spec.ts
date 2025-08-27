import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LieuList } from './lieu-list';

describe('LieuList', () => {
  let component: LieuList;
  let fixture: ComponentFixture<LieuList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LieuList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LieuList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
