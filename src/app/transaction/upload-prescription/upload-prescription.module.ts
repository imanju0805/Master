import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadPrescriptionPageRoutingModule } from './upload-prescription-routing.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import { UploadPrescriptionPage } from './upload-prescription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperModule,
    UploadPrescriptionPageRoutingModule
  ],
  declarations: [UploadPrescriptionPage]
})
export class UploadPrescriptionPageModule {}
