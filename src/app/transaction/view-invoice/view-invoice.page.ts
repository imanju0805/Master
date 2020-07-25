import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, ToastController, MenuController, Platform, NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { OrderService } from 'src/app/shared/services/order.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PrescriptionPage } from '../prescription/prescription.page';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { AccountService } from '../tabs/account/account.service';
import { identifierModuleUrl } from '@angular/compiler';

declare var RazorpayCheckout: any;
@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.page.html',
  styleUrls: ['./view-invoice.page.scss'],
})
export class ViewInvoicePage implements OnInit {
  paymentAmount: number = 100;
  currency: string = 'INR';
  currencyIcon: string = '\u20B9';
  razor_key = 'rzp_live_6G4ZPN5TJWzEqI';
  cardDetails: any = {};
  savings=0;
  data: any;
  showOnSuccess=true;
  viewPrescription = "View";
  openPrescription: any;
  invoiceDetails={
    liInvDtls:[{
      MedicineName:'',
      Price:0,
      Qty:'',
      MRP:0
    }],
    InvoiceMst_Id:'',
    mobNo:'',
    SubTotal:0,
    OtherOff:0,
    GST:0,
    invStatus:0,
    DispatchedOn:'',
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
  total=0;
  sampleNumber: any[];
  orderId: any;
  count: number;
  orderStatus: any;
  cashFreeForm: FormGroup
  ship: any;

  constructor(private router: Router, private route: ActivatedRoute, private alertController: AlertController,
    private modalController: ModalController, public loadingCtrl: LoadingController, private fb: FormBuilder,
    private file: File, private toastController: ToastController, private menu: MenuController, private platform: Platform,
    private fileOpener: FileOpener, private storage: StorageService, private account: AccountService, private navCtrl: NavController,
    private orderService: OrderService) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.invoiceId;
        this.orderId = this.router.getCurrentNavigation().extras.state.orderid;
        this.orderStatus = this.router.getCurrentNavigation().extras.state.status;
        console.log("data= ", this.data);
        console.log("order id=", this.orderId);
      }
    });

  }
  loading: any;

  ngOnInit() {
   // this.getPrescriptionList();
    this.getById();
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
  }

  getPrescriptionList(id) {
    // console.log("order id=",this.data);
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
      this.getPrescriptionList(this.invoiceDetails.Order_Id);
      console.log("constant value=", order.liInvDtls);
      this.total=this.invoiceDetails.Total+this.invoiceDetails.Cust_ServCharge;
      this.savings=Math.round(this.invoiceDetails.MRPSubTotal-this.invoiceDetails.SubTotal);
    })
    this.orderService.getConfig().subscribe(res => {
      let data = JSON.parse(res['_body']);
      console.log("config results=", data);
      this.ship = data.stdShipping;
    })
  }

  slidePage() {
    if (this.orderStatus == 1) {
      this.router.navigateByUrl('/transaction/tabs/order');
    }
    else if (this.orderStatus == 2) {
      this.router.navigateByUrl('/transaction/view-quote');
    }
    else {
      this.router.navigateByUrl('/transaction/tabs/order');
    }

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


 
  async payWithRazor(id,total) {
    console.log("invoice details=", this.invoiceDetails.InvoiceMst_Id);
    let data;
    let custemail;
    await this.storage.getObject("userData").then(res => {
      data = res;
    })
    if(data.custEmail==''){
      
      custemail="account@medv.in";
    }
    else{
      custemail=data.custEmail;
    }
    var options = {
      description: 'ZINPLE INFO SOLUTIONS',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: this.currency,
      key: this.razor_key,
      amount: total,
      name: 'MedV',
      order_id: id,
      Notes: 'Thank You',
      prefill: {
        email: custemail,
        contact: data.mobNo,
        name: data.customerName,

      },
      theme: {
        color: '#004a8e'
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    };
    var successCallback = (payment_id) => {
      let item;
      console.log("payment id=", payment_id);
       this.showOnSuccess=false; 
      this.account.successPayment(this.invoiceDetails.InvoiceMst_Id, 1,this.invoiceDetails.mobNo,id, payment_id).subscribe(res => {
        console.log("response", res);
        item = res;
        let data = JSON.parse(res['_body']);
        console.log("data=", data);
        this.router.navigate(['/transaction/razor',{invoiceData:payment_id}]);
      },error=>{
        if(error.status==500){
          this.showOnSuccess=false;
          this.showToast("Internal Server Error");
        }
      })
    }
    

    var cancelCallback = (error) => {
     this.router.navigate(['/transaction/razor',{invoiceData:error.code,orderid:this.invoiceDetails.Order_Id}]);
      
    }

    RazorpayCheckout.open(options, successCallback, cancelCallback)
  }
 
  createOrder(id) {
    console.log("mobile number=",this.invoiceDetails.mobNo);
    let total = (this.invoiceDetails.Total + this.invoiceDetails.Cust_ServCharge) * 100;
    this.account.creteOrder(total, id).subscribe(res => {
      let data = JSON.parse(res['_body']);
      console.log("order id=", data);
      this.payWithRazor(data.id,total);
    })
  }

async showToast(mesg){
  const toast = await this.toastController.create({  
    message: mesg,
    position: 'top',
    duration: 2000    
  });
  toast.present();
}

}

