import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrescriptionGuidePage } from './prescription-guide.page';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionGuidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrescriptionGuidePageRoutingModule {}
