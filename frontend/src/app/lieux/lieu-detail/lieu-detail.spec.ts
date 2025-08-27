import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LieuDetail } from './lieu-detail';

describe('LieuDetail', () => {
  let component: LieuDetail;
  let fixture: ComponentFixture<LieuDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LieuDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LieuDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
