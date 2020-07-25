import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressSelectionPageRoutingModule } from './address-selection-routing.module';

import { AddressSelectionPage } from './address-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressSelectionPageRoutingModule
  ],
  declarations: [AddressSelectionPage]
})
export class AddressSelectionPageModule {}
