import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RazorPage } from './razor.page';

describe('RazorPage', () => {
  let component: RazorPage;
  let fixture: ComponentFixture<RazorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RazorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RazorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
