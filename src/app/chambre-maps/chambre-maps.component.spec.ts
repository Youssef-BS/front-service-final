import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambreMapsComponent } from './chambre-maps.component';

describe('ChambreMapsComponent', () => {
  let component: ChambreMapsComponent;
  let fixture: ComponentFixture<ChambreMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChambreMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChambreMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
