import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrescriptionConfirmPageRoutingModule } from './prescription-confirm-routing.module';

import { PrescriptionConfirmPage } from './prescription-confirm.page';
import { SearchPageModule } from 'src/app/shared/components/search/search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrescriptionConfirmPageRoutingModule,
    SearchPageModule
  ],
  declarations: [PrescriptionConfirmPage]
})
export class PrescriptionConfirmPageModule {}
