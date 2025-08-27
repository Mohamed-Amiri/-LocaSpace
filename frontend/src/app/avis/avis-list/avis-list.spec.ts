import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisList } from './avis-list';

describe('AvisList', () => {
  let component: AvisList;
  let fixture: ComponentFixture<AvisList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
