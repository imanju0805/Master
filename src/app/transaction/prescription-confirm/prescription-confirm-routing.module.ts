import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrescriptionConfirmPage } from './prescription-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionConfirmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionConfirmPageRoutingModule {}
