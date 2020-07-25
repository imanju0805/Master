import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaskPageRoutingModule } from './mask-routing.module';

import { MaskPage } from './mask.page';

import { SharedModule } from 'src/app/shared/shared.module';

import { MaterialModule } from 'src/app/material.module';
 // import { CartbtnPageModule } from 'src/app/shared/components/cartbtn/cartbtn.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  // CartbtnPageModule,
    IonicModule,
    MaterialModule,
   MaskPageRoutingModule,
   SharedModule
  ],
  declarations: [MaskPage],
  exports:[MaskPage]
})
export class MaskPageModule {}
