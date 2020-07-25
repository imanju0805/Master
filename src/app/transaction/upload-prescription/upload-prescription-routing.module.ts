import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadPrescriptionPage } from './upload-prescription.page';

const routes: Routes = [
  {
    path: '',
    component: UploadPrescriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadPrescriptionPageRoutingModule {}
