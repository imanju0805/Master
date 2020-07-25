import { Component } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AccountService } from 'src/app/transaction/tabs/account/account.service';
import { Platform } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';



@Component({
  selector: 'app-razor',
  templateUrl: 'razor.page.html',
  styleUrls: ['razor.page.scss'],
})
export class RazorPage {
  paymentAmount: number = 100;
  currency: string = 'INR';
  currencyIcon: string = '\u20B9';
  razor_key = 'rzp_test_G03M5sooUhmeTY';
  cardDetails: any = {};
  invoiceDetails: any;
  showSuccess = false;
  showFailure = false;
  orderDetails: string;
  orderId: any;
  error: any;
  description: any;
  state: { [k: string]: any; };

  constructor(private storage: StorageService, private route: ActivatedRoute, private orderService:OrderService,
    private router: Router, private platform: Platform, private account: AccountService) {
    this.invoiceDetails= this.route.snapshot.paramMap.get("invoiceData");
      this.orderId=this.route.snapshot.paramMap.get("orderid");
  }

  async ngOnInit() {
   // this.invoiceDetails=0;
    let data=this.invoiceDetails;//here it is object not working for condition
    if (data==0) {// after ths apk u just cancel we will see transaction failed it shows or not ok
     
      this.showFailure = true;
    }
    else{
      this.showSuccess=true;
    }
    console.log("data= ", this.invoiceDetails);
  }
  homePage() {
    this.router.navigateByUrl('/transaction/tabs/home');
  }
  invoicePage(){
    
    this.viewQuotePage(this.orderId);
  }
  viewQuotePage(id) {
    let invcId;
    let o_id;
    this.orderService.getInvListbyOrder(id).subscribe(result => {
      console.log(result['_body']);

      this.orderDetails = JSON.parse(result['_body']);
      console.log("Medicine Name =", this.orderDetails);
      let order = JSON.parse(result['_body']);
      for (let i = 0; i < order.length; i++) {
        console.log("invoice =", order[i].InvoiceMst_Id);
        o_id = order[i];
      }
      if (order.length == 1) {
        console.log("single order details=", o_id);

        invcId = o_id.InvoiceMst_Id;
        console.log("invoice id==", invcId);
        let navigationExtras: NavigationExtras = {
          state: {
            invoiceId: invcId,
            orderid: o_id.Order_Id,
            status: 1
          }
        };
        this.router.navigateByUrl('/transaction/view-invoice', navigationExtras);
      }
      else {
        let navigationExtras: NavigationExtras = {
          state: {

            orderId: id
          }
        };
        this.router.navigateByUrl('/transaction/view-quote', navigationExtras);
      }


    })
  }

}
