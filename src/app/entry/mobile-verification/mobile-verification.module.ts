import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MobileVerificationPageRoutingModule } from './mobile-verification-routing.module';

import { MobileVerificationPage } from './mobile-verification.page';
import { PhoneMaskDirective } from 'src/app/phone-mask.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MobileVerificationPageRoutingModule
  ],
  declarations: [MobileVerificationPage,PhoneMaskDirective]
})
export class MobileVerificationPageModule {}
