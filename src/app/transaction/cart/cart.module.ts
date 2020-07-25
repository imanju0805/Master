import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartPageRoutingModule } from './cart-routing.module';

import { CartPage } from './cart.page';
import { CartButtonPageModule } from 'src/app/shared/components/cart-button/cart-button.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchPageModule } from 'src/app/shared/components/search/search.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    CartButtonPageModule,
    SearchPageModule,
    SharedModule
  ],
  declarations: [CartPage]
})
export class CartPageModule {}
