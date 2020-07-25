import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewInvoiceReceiptPageRoutingModule } from './view-invoice-receipt-routing.module';

import { ViewInvoiceReceiptPage } from './view-invoice-receipt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewInvoiceReceiptPageRoutingModule
  ],
  declarations: [ViewInvoiceReceiptPage]
})
export class ViewInvoiceReceiptPageModule {}
