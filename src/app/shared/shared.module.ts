import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { IonicModule } from '@ionic/angular';
import { UploadButtonCardComponent } from './components/upload-button-card/upload-button-card.component';
import { PrescriptionPageModule } from '../transaction/prescription/prescription.module';
import { SlideImageComponent } from './components/slide-image/slide-image.component';
import { SlideProductComponent } from './components/slide-product/slide-product.component';



@NgModule({
  declarations: [UploadButtonCardComponent,SlideImageComponent,SlideProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedRoutingModule
  ],
  exports:[
    UploadButtonCardComponent,SlideImageComponent,SlideProductComponent
  ]
  
})
export class SharedModule { }
