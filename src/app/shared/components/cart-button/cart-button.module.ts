import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartButtonPageRoutingModule } from './cart-button-routing.module';

import { CartButtonPage } from './cart-button.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartButtonPageRoutingModule
  ],
  declarations: [CartButtonPage],
  exports:[CartButtonPage]
})
export class CartButtonPageModule {}
