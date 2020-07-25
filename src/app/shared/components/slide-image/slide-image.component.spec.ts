import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlideImageComponent } from './slide-image.component';

describe('SlideImageComponent', () => {
  let component: SlideImageComponent;
  let fixture: ComponentFixture<SlideImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideImageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
