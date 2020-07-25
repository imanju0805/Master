import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewInvoiceReceiptPage } from './view-invoice-receipt.page';

describe('ViewInvoiceReceiptPage', () => {
  let component: ViewInvoiceReceiptPage;
  let fixture: ComponentFixture<ViewInvoiceReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInvoiceReceiptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewInvoiceReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
