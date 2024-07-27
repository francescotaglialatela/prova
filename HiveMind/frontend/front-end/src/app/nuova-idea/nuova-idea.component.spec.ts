import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovaIdeaComponent } from './nuova-idea.component';

describe('NuovaIdeaComponent', () => {
  let component: NuovaIdeaComponent;
  let fixture: ComponentFixture<NuovaIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuovaIdeaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuovaIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
