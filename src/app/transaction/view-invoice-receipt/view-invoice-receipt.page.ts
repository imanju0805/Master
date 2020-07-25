import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ToastController, MenuController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { OrderService } from 'src/app/shared/services/order.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PrescriptionPage } from '../prescription/prescription.page';
import { StorageService } from 'src/app/shared/services/storage.service';
@Component({
  selector: 'app-view-invoice-receipt',
  templateUrl: './view-invoice-receipt.page.html',
  styleUrls: ['./view-invoice-receipt.page.scss'],
})
export class ViewInvoiceReceiptPage implements OnInit {
  data: any;
  savings=0;
  viewPrescription = "View";
  openPrescription: any;
  invoiceDetails={
    liInvDtls:[{
      MedicineName:'',
      Price:0,
      Qty:'',
      MRP:0
    }],
    LandMark:'',
    Merchant_Name:"",
    InvoiceMst_Id:'',
    SubTotal:0,
    OtherOff:0,
    GST:0,
    invStatus:0,
    Shipping:0,
    MRPSubTotal:0,
    OrderDate:'',
    ordStatus:0,
    Order_Id:'',
  PaidOn:'',
  PayRefNo:'',
    Total:0,
    Cust_ServCharge:0
  };
  sampleNumber: any[];
  orderId: any;
  count: number;
  orderStatus: any;
  ordId: any;
  ship: any;
  total=0;
  constructor(private router: Router, private route: ActivatedRoute, private alertController: AlertController,
    private modalController: ModalController, public loadingCtrl: LoadingController, private menu: MenuController,
    private file: File, private toastController: ToastController, private storage: StorageService,
    private fileOpener: FileOpener,
    private orderService: OrderService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.invoiceId;
       // this.orderId = this.router.getCurrentNavigation().extras.state.orderid;
        this.ordId = this.router.getCurrentNavigation().extras.state.ordId;
        this.orderStatus = this.router.getCurrentNavigation().extras.state.status;
        console.log("data= ", this.data);
        //console.log("order id=", this.orderId);
        console.log("order id details=", this.ordId);
      }
    });
  } loading: any;

  ngOnInit() {

    this.getById();
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
  }

  getPrescriptionList(id) {

    this.orderService.getPrescriptionList(id).subscribe(res => {
      this.sampleNumber = JSON.parse(res['_body']);
      console.log("result=", this.sampleNumber);
      this.count = this.sampleNumber.length;
    })
  }

  async presentLoading(msg) {
    this.loading = await this.loadingCtrl.create({
      message: msg
    });
    return this.loading.present();
  }

  // exportPdf() {
  //   this.presentLoading('Creating PDF file...');
  //   let div = document.getElementById("printable-area");
  //   let options = { background: "white", height: div.clientWidth, width: div.clientHeight };
  //   domtoimage.toPng(div, options).then((dataUrl) => {
  //     var doc = new jsPDF("p", "mm", "a4");
  //     doc.addImage(dataUrl, 'PNG', 20, 20, 240, 180);

  //     let pdfOutput = doc.output();
  //     let buffer = new ArrayBuffer(pdfOutput.length);
  //     let array = new Uint8Array(buffer);
  //     for (var i = 0; i < pdfOutput.length; i++) {
  //       array[i] = pdfOutput.charCodeAt(i);
  //     }
  //     let directory = this.file.dataDirectory;
  //     let fileName = "invoice.pdf";
  //     let options: IWriteOptions = { replace: true };
  //     this.file.checkFile(directory, fileName).then((success) => {
  //       this.file.writeFile(directory, fileName, buffer, options)
  //         .then((success) => {
  //           this.loading.dismiss();
  //           console.log("File created Succesfully" + JSON.stringify(success));
  //           this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
  //             .then(() => console.log('File is opened'))
  //             .catch(e => console.log('Error opening file', e));
  //         })
  //         .catch((error) => {
  //           this.loading.dismiss();
  //           console.log("Cannot Create File " + JSON.stringify(error));
  //         });
  //     })
  //       .catch((error) => {
  //         this.file.writeFile(directory, fileName, buffer)
  //           .then((success) => {
  //             this.loading.dismiss();
  //             console.log("File created Succesfully" + JSON.stringify(success));
  //             this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
  //               .then(() => console.log('File is opened'))
  //               .catch(e => console.log('Error opening file', e));
  //           })
  //           .catch((error) => {
  //             this.loading.dismiss();
  //             console.log("Cannot Create File " + JSON.stringify(error));
  //           });
  //       });
  //   })
  //     .catch(function (error) {
  //       this.loading.dismiss();
  //       console.error('oops, something went wrong!', error);
  //     });
  // }

  async getById() {
    await this.orderService.getInvoiceById(this.data).subscribe(result => {
      console.log(result['_body']);
      this.invoiceDetails = JSON.parse(result['_body']);
      var d = new Date(this.invoiceDetails.PaidOn).toLocaleString();
      console.log("date=", d);
      console.log("Medicine Name =", this.invoiceDetails);
      const order = this.invoiceDetails;
      console.log("constant value=", order.liInvDtls);
      this.getPrescriptionList(this.invoiceDetails.Order_Id);
      this.total=(this.invoiceDetails.Total)+(this.invoiceDetails.Cust_ServCharge);
      this.savings=Math.round(this.invoiceDetails.MRPSubTotal-this.invoiceDetails.SubTotal);
    })
    this.orderService.getConfig().subscribe(res => {
      let data = JSON.parse(res['_body']);
      this.ship = data.stdShipping;
      console.log("data=", data);
    })
  }

  slidePage() {
    if(this.orderStatus==2)
    {
      this.router.navigateByUrl('transaction/my-orders');
    }
   
  }


  slidePage1() {
    this.router.navigateByUrl('/transaction/tabs/order');
  }

  async presentModal(value, item) {
    console.log("index=", value);
    console.log('item=', item);
    const modal = await this.modalController.create({
      component: PrescriptionPage,
      backdropDismiss: false,
      componentProps: { orderid: value, data: item },
    });
    modal.present();
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
  async showPopup(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: "top",
      duration: 3000,
    });
    toast.present();
  }
  async itemReceived() {
    let id;
    await this.storage.getObject("userData").then(res => {
      id = res.custId;

    });
    console.log("invoice id=", this.data);
    console.log("customer id=", id);
    this.orderService.updateItemReceived(this.data, id).subscribe(res => {
      console.log("result=", res);
      let data = JSON.parse(res['_body']);
      console.log("response in data=", data);
      if (data == 1) {
        this.router.navigateByUrl("/transaction/tabs/order");
      }
    })

  }

}
