import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RazorPageRoutingModule } from './razor-routing.module';

import { RazorPage } from './razor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RazorPageRoutingModule
  ],
  declarations: [RazorPage]
})
export class RazorPageModule {}
