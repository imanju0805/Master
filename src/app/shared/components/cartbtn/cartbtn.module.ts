import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartbtnPageRoutingModule } from './cartbtn-routing.module';

import { CartbtnPage } from './cartbtn.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartbtnPageRoutingModule
  ],
  declarations: [CartbtnPage],

  exports:[CartbtnPage]
})
export class CartbtnPageModule {}
