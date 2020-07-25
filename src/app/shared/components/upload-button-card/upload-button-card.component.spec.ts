import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UploadButtonCardComponent } from './upload-button-card.component';

describe('UploadButtonCardComponent', () => {
  let component: UploadButtonCardComponent;
  let fixture: ComponentFixture<UploadButtonCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadButtonCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadButtonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
