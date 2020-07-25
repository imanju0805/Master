import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';

import { IonContent, ModalController, AlertController, Platform } from '@ionic/angular';
import { OrderService } from 'src/app/shared/services/order.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {


  @ViewChild(IonContent, { static: false }) content: IonContent;
  segment: number;
  listCount:any;
  toggle = true;
  orderDetails: any;
  sampleNumber: any[] = [1, 2, 3];
  openPrescription: any;
  pres = "View";
  custorderId: any;
  showPresrciption = true;
  custId: any;
  paidDetails: any[];
  respData: any;
  private subscription: Subscription;

  constructor(private router: Router, private orderService: OrderService, private appMinimize: AppMinimize, private platform: Platform,
    private storage: StorageService, private storageService: StorageService, private alertController: AlertController,
    private modalController: ModalController) {
    this.segment = 0;

  }

  async ngOnInit(): Promise<void> {

    this.orderService.refreshNeeded$.subscribe(() => {
      this.orderUpdate();

    });
    this.orderUpdate();


  }



  async ionViewWillEnter(): Promise<void> {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url == '/transaction/tabs/order') {
        this.orderUpdate();


      }
    });
    console.log("working==");
    this.orderUpdate();

  }



  async orderUpdate() {
    await this.storageService.getObject('userData').then(res => {
      this.custId = res.custId;
      console.log("customer id=", this.custId);
      this.orderService.itemReceived(this.custId).subscribe(res => {
        this.orderDetails = JSON.parse(res['_body']);
        this.listCount=this.orderDetails.length;
        console.log("item received details", this.orderDetails);
      })
    })

  }

  viewInvoice(item, index) {
    let navigationExtras: NavigationExtras = {
      state: {
        invoiceId: item.InvoiceMst_Id
      }
    };
    this.router.navigateByUrl('/transaction/view-invoice-receipt', navigationExtras);
  }


  someAction(idx) {

    console.log("index= ", idx);

  }

  back1() {
    this.router.navigateByUrl('/transaction/tabs/home');
  }

  editProfile() {
    this.router.navigateByUrl('/transaction/tabs/account');
  }

  public async setSegment(activeIndex: Promise<number>) {
    this.segment = await activeIndex;
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }
  selectChange(e) {
    console.log(e);
  }
  ScrollToTop() {
    this.content.scrollToTop(500);
  }
  logScrollStart() {
    console.log("logScrollStart : When Scroll Starts");
  }

  logScrolling() {
    console.log("logScrolling : When Scrolling");
  }

  logScrollEnd() {
    console.log("logScrollEnd : When Scroll Ends");
  }

  ScrollToBottom() {
    this.content.scrollToBottom(1500);
  }


  ScrollToPoint(X, Y) {
    this.content.scrollToPoint(X, Y, 1500);
  }
  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      this.orderUpdate();

      console.log('Async operation has ended');

      event.target.complete();
    }, 2000);
  }
  ionPull(event) {
    console.log('ionPull Event Triggered!');
  }
  ionStart(event) {
    console.log('ionStart Event Triggered!');
  }
  nextPage(item, idx) {
    console.log("working...");
    console.log("orderid=", item.Order_Id);
    this.viewQuotePage(item.Order_Id);

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
     
        console.log("single order details=", o_id);

        invcId = o_id.InvoiceMst_Id;
        console.log("invoice id==", invcId);
        let navigationExtras: NavigationExtras = {
          state: {
            invoiceId: invcId,
            ordId: o_id,
            status: 2
          }
        };
        this.router.navigateByUrl('/transaction/view-invoice-receipt', navigationExtras);
      
      // else {
      //   let navigationExtras: NavigationExtras = {
      //     state: {

      //       orderId: id
      //     }
      //   };
      //   this.router.navigateByUrl('/transaction/view-quote', navigationExtras);
      // }


    })
  }
  checkPrescription(name, item) {
    console.log("name=", name);
    console.log("item detail", item);
    console.log("orderDetails=", this.orderDetails);
    this.custorderId = item.Order_Id;
    let navigationExtras: NavigationExtras = {
      state: {
        orderId: this.custorderId,
        id: item
      }
    };
    this.router.navigateByUrl('/transaction/view-order', navigationExtras);

  }
  hidePrescription() {
    this.showPresrciption = true;
    this.openPrescription = !this.openPrescription;
  }
  async remove(index) {
    const alert = await this.alertController.create({
      message: 'Do you want to Delete this prescription?',
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

}
