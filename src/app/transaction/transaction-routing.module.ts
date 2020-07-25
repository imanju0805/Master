import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "tabs",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./cart/cart.module").then((m) => m.CartPageModule),
  },

  {
    path: "view-quote",
    loadChildren: () =>
      import("./view-quote/view-quote.module").then((m) => m.ViewQuotePageModule),
  },
  {
    path: "view-invoice",
    loadChildren: () =>
      import("./view-invoice/view-invoice.module").then((m) => m.ViewInvoicePageModule),
  },
  {
    path: "prescription",
    loadChildren: () =>
      import("./prescription/prescription.module").then((m) => m.PrescriptionPageModule),
  },
  {
    path: "view-invoice-receipt",
    loadChildren: () =>
      import("./view-invoice-receipt/view-invoice-receipt.module").then((m) => m.ViewInvoiceReceiptPageModule),
  },
  {
    path: "view-order",
    loadChildren: () =>
      import("./view-order/view-order.module").then((m) => m.ViewOrderPageModule),
  },
  {
    path: "cart/:orderType?",
    loadChildren: () =>
      import("./cart/cart.module").then((m) => m.CartPageModule),
  },
  {
    path: "upload-prescription/:status",
    loadChildren: () =>
      import("./upload-prescription/upload-prescription.module").then(
        (m) => m.UploadPrescriptionPageModule
      ),
  },
  {

    path: 'razor',
    loadChildren: () => import('./razor/razor.module').then(m => m.RazorPageModule)

  },
  {
    path: "prescription-confirm",
    loadChildren: () =>
      import("./prescription-confirm/prescription-confirm.module").then(
        (m) => m.PrescriptionConfirmPageModule
      ),
  },
  {
    path: "no-network",
    loadChildren: () =>
      import("./no-network/no-network.module").then((m) => m.NoNetworkPageModule),
  },
  {
    path: "address-selection/:uploadType",
    loadChildren: () =>
      import("./address-selection/address-selection.module").then(
        (m) => m.AddressSelectionPageModule
      ),
  },
  {
    path: "order-summary",
    loadChildren: () =>
      import("./order-summary/order-summary.module").then(
        (m) => m.OrderSummaryPageModule
      ),
  },
  {
    path: "popover",
    loadChildren: () =>
      import("./popover/popover.module").then(
        (m) => m.PopoverPageModule
      ),
  },
  {
    path: "order-status/:merchantCount",
    loadChildren: () =>
      import("./order-status/order-status.module").then(
        (m) => m.OrderStatusPageModule
      ),
  },
  {
    path: 'prescription-guide',
    loadChildren: () => import('./prescription-guide/prescription-guide.module').then(m => m.PrescriptionGuidePageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then(m => m.EditProfilePageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
  },
  {
    path: 'view-all',
    loadChildren: () => import('./view-all/view-all.module').then( m => m.ViewAllPageModule)
  },
  {
    path: 'mask',
    loadChildren: () => import('./mask/mask.module').then( m => m.MaskPageModule)
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule { }
