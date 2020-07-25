import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewQuotePage } from './view-quote.page';

describe('ViewQuotePage', () => {
  let component: ViewQuotePage;
  let fixture: ComponentFixture<ViewQuotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewQuotePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewQuotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
