import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambresDisponiblesComponent } from './chambres-disponibles.component';

describe('ChambresDisponiblesComponent', () => {
  let component: ChambresDisponiblesComponent;
  let fixture: ComponentFixture<ChambresDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambresDisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambresDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
