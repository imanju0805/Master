import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartButtonPage } from './cart-button.page';

describe('CartButtonPage', () => {
  let component: CartButtonPage;
  let fixture: ComponentFixture<CartButtonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartButtonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartButtonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
