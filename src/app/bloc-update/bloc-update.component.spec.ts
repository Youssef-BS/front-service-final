import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocUpdateComponent } from './bloc-update.component';

describe('BlocUpdateComponent', () => {
  let component: BlocUpdateComponent;
  let fixture: ComponentFixture<BlocUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlocUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
