import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, MenuController, Platform } from '@ionic/angular';
import { OrderService } from 'src/app/shared/services/order.service';



@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.page.html',
  styleUrls: ['./view-quote.page.scss'],
})
export class ViewQuotePage implements OnInit {
  openPrescription: any;
  viewPrescription = "View";
  data: any;
  orderDetails: any;
  sampleNumber: any[] = [1, 2, 3];
  total: number;
  dis: number;
  gstCost: number;
  shipping: number;
  grandTotal: number;
  buttonSubscribe: any;
  count: any;

  constructor(private router: Router, private alertController: AlertController, private modalController: ModalController,
    private route: ActivatedRoute, private orderService: OrderService, private menu: MenuController, private platform: Platform,) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.orderId;


        console.log("data= ", this.data);
      }
    });
  }

  ngOnInit() {
    this.orderService.getInvListbyOrder(this.data).subscribe(result => {
      this.orderDetails = JSON.parse(result['_body']);
      this.count=this.orderDetails.length;
      console.log("response data=",this.orderDetails);
    })
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {

      console.log("Account hardware back button pressed");
      this.router.navigate(['transaction/tabs/order']);

    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }
  slidePage() {
    this.router.navigateByUrl('/transaction/tabs/order');
  }

  checkPrescription(name, i) {
    console.log("index =", i);
    console.log("name=", name);
    this.openPrescription = !this.openPrescription;
    if (name === 'View') {
      this.viewPrescription = "Hide";
    }
    else {
      this.viewPrescription = "View";
    }
  }
  async cancel(index) {
    const alert = await this.alertController.create({
      message: 'Do you want to cancel this order?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();

  }

  viewInvoice(id) {
    console.log("Invoice id=", id);

    let navigationExtras: NavigationExtras = {
      state: {
        invoiceId: id,
        orderid: this.data,
        status: 2
      }
    };
    this.router.navigateByUrl('/transaction/view-invoice', navigationExtras);
  }
}
