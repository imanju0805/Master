import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPageRoutingModule } from './search-routing.module';
import { SearchPage } from './search.page';
import { MaterialModule } from 'src/app/material.module';
import { CartButtonPageModule } from 'src/app/shared/components/cart-button/cart-button.module';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    MaterialModule,
    CartButtonPageModule,
    SharedModule
  ],
  declarations: [SearchPage],
  exports:[SearchPage]
})
export class SearchPageModule {}
