import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },

  {
    path: 'entry',
   
    loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule)
  },
  {
    path: 'transaction',
    
    loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule)
  },
 






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
