import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartbtnPage } from './cartbtn.page';

describe('CartbtnPage', () => {
  let component: CartbtnPage;
  let fixture: ComponentFixture<CartbtnPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartbtnPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartbtnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
