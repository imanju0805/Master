import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController, MenuController, Platform } from '@ionic/angular';
import { OrderService } from 'src/app/shared/services/order.service';
import { PrescriptionPage } from '../prescription/prescription.page';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
  data: any;
  orderDetails: any;
  viewPrescription = "View";
  openPrescription: any;
  sampleNumber: any[];
  orderId: any;
  count: number;
  custId: any;
  constructor(private router: Router, private platform: Platform, private route: ActivatedRoute, private alertController: AlertController,
    private modalController: ModalController, private storageService: StorageService, private menu: MenuController,
    private orderService: OrderService) {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.orderId;
        this.orderId = this.router.getCurrentNavigation().extras.state.id;

        console.log("data=", this.orderId);

      }
    });
    this.platform.backButton.subscribe(() => {
      console.log('Another handler was called!');
      if (this.router.url === "/transaction/view-order") {

        this.router.navigate(["/transaction/tabs/order"]);

      }


    });
  }

  ngOnInit() {
    this.getPrescriptionList();
    this.getById();

  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
  }
  getPrescriptionList() {
    this.orderService.getPrescriptionList(this.orderId.Order_Id).subscribe(res => {
      this.sampleNumber = JSON.parse(res['_body']);
      console.log("result=", this.sampleNumber);
      this.count = this.sampleNumber.length;
    })
  }
  async getById() {
    await this.orderService.getQuoteSubmit(this.data).subscribe(result => {
      console.log(result['_body']);
      this.orderDetails = JSON.parse(result['_body']);
      console.log("Medicine Name =", this.orderDetails);
      const order = this.orderDetails;
      console.log("constant value=", order.liOrdDtls);

    })
  }

  async cancelOrder(data, Customer_Id) {
    await this.storageService.getObject('userData').then(res => {
      this.custId = res.custId;
    })
    console.log("data=", data);
    console.log("customer id=", this.custId);
    this.showAlertCancel(data, this.custId);

  }
  async showAlertCancel(data, custId) {

    const alert = await this.alertController.create({
      message: 'Do you want to cancel this order?',
      buttons: [
        {
          text: 'Cancel',

          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Ok',

          cssClass: 'secondary',
          handler: (blah) => {
            this.cancelInvoiceOrder(data, custId);
            console.log('Confirm Cancel: blah');
          }
        }

      ]
    });

    await alert.present();

  }
  cancelInvoiceOrder(data, custId) {
    let item: number;
    this.orderService.cancelOrder(data, custId).subscribe(res => {
      console.log("z", res);
      let data = JSON.parse(res['_body']);

      console.log("data= ", + data);
      console.log("String to number=", item);
      if (+data == 1) {
        console.log(data == "1");
        console.log("order cancelled", data);
        this.router.navigateByUrl('/transaction/tabs/order');
      }
      else {
        console.log(+data == -1);
        this.notCancel();
        console.log("order not cancelled", data);

      }
    });
  }
  async notCancel() {
    const alert = await this.alertController.create({
      message: 'You cannot cancel this order after quote has been submitted',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'secondary',
          handler: (blah) => {
            this.router.navigateByUrl('/transaction/view-order');
            console.log('Confirm Cancel: blah');
          }
        }

      ]
    });

    await alert.present();
  }
  async alertCancel(Order_Id, Customer_Id) {

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
        }

      ]
    });

    await alert.present();

  }
  slidePage() {
    this.router.navigateByUrl('transaction/tabs/order');
  }

  async presentModal(value, item) {
    const modal = await this.modalController.create({
      component: PrescriptionPage,
      backdropDismiss: false,
      componentProps: { orderid: value.Order_Id, data: item },
      cssClass: 'my-custom-modal-css',

    });
    modal.present();

  }
  back() {
    this.router.navigateByUrl("/transaction/tabs/order");
  }
  checkPrescription(name) {
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
  show() {
    this.router.navigateByUrl('/transaction/view-quote');
  }
}
