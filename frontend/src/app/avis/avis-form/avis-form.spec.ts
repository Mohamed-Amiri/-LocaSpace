import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisForm } from './avis-form';

describe('AvisForm', () => {
  let component: AvisForm;
  let fixture: ComponentFixture<AvisForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
