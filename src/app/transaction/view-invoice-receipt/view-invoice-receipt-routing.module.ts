import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewInvoiceReceiptPage } from './view-invoice-receipt.page';

const routes: Routes = [
  {
    path: '',
    component: ViewInvoiceReceiptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewInvoiceReceiptPageRoutingModule {}
