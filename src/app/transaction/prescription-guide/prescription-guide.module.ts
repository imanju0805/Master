import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrescriptionGuidePageRoutingModule } from './prescription-guide-routing.module';

import { PrescriptionGuidePage } from './prescription-guide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrescriptionGuidePageRoutingModule
  ],
  declarations: [PrescriptionGuidePage]
})
export class PrescriptionGuidePageModule {}
