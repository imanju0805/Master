import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RazorPage } from './razor.page';

const routes: Routes = [
  {
    path: '',
    component: RazorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RazorPageRoutingModule {}
