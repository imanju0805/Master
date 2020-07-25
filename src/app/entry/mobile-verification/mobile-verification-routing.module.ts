import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MobileVerificationPage } from './mobile-verification.page';

const routes: Routes = [
  {
    path: '',
    component: MobileVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileVerificationPageRoutingModule {}
