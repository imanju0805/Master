import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewInvoicePageRoutingModule } from './view-invoice-routing.module';

import { ViewInvoicePage } from './view-invoice.page';
import { PrescriptionPageModule } from '../prescription/prescription.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ViewInvoicePageRoutingModule
  ],
  declarations: [ViewInvoicePage],
})
export class ViewInvoicePageModule { }
