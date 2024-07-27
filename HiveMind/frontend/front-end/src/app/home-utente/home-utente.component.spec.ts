import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUtenteComponent } from './home-utente.component';

describe('HomeUtenteComponent', () => {
  let component: HomeUtenteComponent;
  let fixture: ComponentFixture<HomeUtenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeUtenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeUtenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
