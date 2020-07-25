import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileVerificationPage } from './mobile-verification.page';

describe('MobileVerificationPage', () => {
  let component: MobileVerificationPage;
  let fixture: ComponentFixture<MobileVerificationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileVerificationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
