import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationDashboardComponent } from './translation-dashboard.component';

describe('TranslationDashboardComponent', () => {
  let component: TranslationDashboardComponent;
  let fixture: ComponentFixture<TranslationDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranslationDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
