import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressSelectionPage } from './address-selection.page';

describe('AddressSelectionPage', () => {
  let component: AddressSelectionPage;
  let fixture: ComponentFixture<AddressSelectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressSelectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
