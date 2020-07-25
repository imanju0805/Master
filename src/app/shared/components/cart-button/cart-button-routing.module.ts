import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartButtonPage } from './cart-button.page';

const routes: Routes = [
  {
    path: '',
    component: CartButtonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartButtonPageRoutingModule {}
