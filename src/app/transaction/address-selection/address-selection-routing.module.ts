import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressSelectionPage } from './address-selection.page';

const routes: Routes = [
  {
    path: '',
    component: AddressSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressSelectionPageRoutingModule {}
