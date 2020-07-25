import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrescriptionPageRoutingModule } from './prescription-routing.module';
import { PrescriptionPage } from './prescription.page';
import { ViewInvoicePage } from '../view-invoice/view-invoice.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
 // entryComponents:[PrescriptionPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PrescriptionPageRoutingModule
  ],
  
  declarations: [PrescriptionPage],
  exports:[PrescriptionPage]

})
export class PrescriptionPageModule {}
