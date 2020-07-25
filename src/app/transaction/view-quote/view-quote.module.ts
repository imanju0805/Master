import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewQuotePageRoutingModule } from './view-quote-routing.module';

import { ViewQuotePage } from './view-quote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewQuotePageRoutingModule
  ],
  declarations: [ViewQuotePage]
})
export class ViewQuotePageModule {}
