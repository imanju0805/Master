import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlideProductComponent } from './slide-product.component';

describe('SlideProductComponent', () => {
  let component: SlideProductComponent;
  let fixture: ComponentFixture<SlideProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideProductComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
