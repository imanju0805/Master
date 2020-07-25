import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaskPage } from './mask.page';

describe('MaskPage', () => {
  let component: MaskPage;
  let fixture: ComponentFixture<MaskPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaskPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
