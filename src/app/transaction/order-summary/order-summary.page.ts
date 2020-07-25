import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AddressSelectionService } from "../address-selection/address-selection.service";
import { UploadPrescriptionService } from "../upload-prescription/upload-prescription.service";
import { StorageService } from 'src/app/shared/services/storage.service';
import { NavController, LoadingController, ToastController, MenuController, Platform } from '@ionic/angular';

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.page.html",
  styleUrls: ["./order-summary.page.scss"],
})
export class OrderSummaryPage implements OnInit {
  private addressId: any;
  public deliveryAddress: any;
  public imageArray: Array<any> = [];
  public medicinList: Array<any> = [];
  user: any;
  viewComment: any;
  addres: any;
  uploadId: any;
  custId: any;
  addId: any;
  comment = "";
  hideComment = true;
  buttonSubscribe: any;
  disabledButton=false;
  constructor(
    private route: ActivatedRoute,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private addressService: AddressSelectionService,
    private uploadPriscription: UploadPrescriptionService,
    private router: Router, private menu: MenuController, private platform: Platform,
    private storageService: StorageService
  ) {
    this.route.params.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.addres = this.router.getCurrentNavigation().extras.state.data;
        this.uploadId = this.router.getCurrentNavigation().extras.state.id;
        this.addId = this.router.getCurrentNavigation().extras.state.adresId;
        this.comment = this.router.getCurrentNavigation().extras.state.comment;
        console.log("address = ", this.addres);
        console.log("id= ", this.uploadId);
        console.log("address id = ", this.addId);
        console.log("comment came from address selection=", this.comment);

        if (this.comment == '') {
          this.hideComment = false;
          this.comment = '';
        }
        else if (this.comment == 'undefined') {
          this.comment = '';
          this.hideComment = false;
        }
        else {
          this.hideComment = true;
        }

      }
    });
    console.log("inside constructor");

  }
  async ngOnInit() {
    await this.storageService.getObject('userData').then(res => {
      this.custId = res.custId;
      let medicinList = [];
      let uploadStatus: any = this.uploadId
      if (uploadStatus == 1 || uploadStatus == 2) {
        medicinList = localStorage.getItem("cart")
          ? JSON.parse(localStorage.getItem("cart"))
          : [];
      }
      console.log("medicine list",medicinList);
      let imageArray = [];
      if (uploadStatus == 1 || uploadStatus==2) {
        imageArray = localStorage.getItem("prescriptions")
          ? JSON.parse(localStorage.getItem("prescriptions"))
          : [];
      }
      console.log("prescription list=",imageArray);
      this.imageArray = imageArray;
      this.medicinList = medicinList;
      this.getAddressDetails();
      this.getUserId();
    })
    console.log("details=", this.medicinList);
  }
  getUserId() {
    this.storageService.getObject('userData').then(res => {
      this.user = res;
    })

  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {

      console.log("Account hardware back button pressed");
      this.router.navigate(['transaction/address-selection', 1, { data: this.comment }]);

    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }

  getAddressDetails() {
    console.log("add id=", this.addId);
    this.addressService.getCustomerAddressList(this.custId).subscribe((res: any) => {
      this.deliveryAddress = res
        .filter((item) => item.AddressId == this.addId)
        .reduce((data, item) => {
          data = item;
          return data;
        }, {});
    });
  }

  get AddressLabel() {
    return this.deliveryAddress && this.deliveryAddress.AddLabel
      ? this.deliveryAddress.AddLabel
      : "";
  }

  get Address() {
    return this.deliveryAddress && this.deliveryAddress.Address
      ? this.deliveryAddress.Address
      : "";
  }

  async confirmOrder() {
    this.disabledButton=true;
    let uploadStatus: any = this.uploadId
    let medicinList = [{ DrugDtls: "Drug per medicine", Id: 169507, count: 1 }];
    if (uploadStatus == 1 || uploadStatus == 2) {
      medicinList = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [{ DrugDtls: "Drug per medicine", Id: 169507, count: 1 }];
    }
    this.uploadPriscription.createOrder(this.user.custId, medicinList, this.addId, this.comment)
      .subscribe(async (res) => {
        console.log("notified ", res.notifiedMerCount);
        if (this.imageArray.length && (uploadStatus == 1 || uploadStatus==2)) {
          console.log("upload status=", uploadStatus)
          this.uploadPriscription.uploadPrescriptions(this.imageArray, res.orderId)
            .subscribe(async (response) => {
              console.log("response=", response);
              if (res.notifiedMerCount == 0) {
                console.log("dont remove cart and prescription");
              }
              else {
                localStorage.removeItem("prescriptions");//we are removing prescription after placed then y its not clearing
                localStorage.removeItem("cart");
              }

            });
          this.router.navigate([
            "transaction/order-status",
            res.notifiedMerCount,
          ]);

        } else {
          this.router.navigate([
            "transaction/order-status",
            res.notifiedMerCount,
          ]);
          this.uploadId = '';
          this.addId = '';
          this.addres = '';
          console.log("confirm order=", res);
        }
      });
      const loader = await this.loadingCtrl.create({
        duration: 2000,
        translucent: true,
      cssClass: 'my-custom-class',
      showBackdrop:false
      });
  
      loader.present();
      loader.onWillDismiss().then(async l => {
      
  
        //toast.present();
  
      });
  }
  showMessage() {

  }
}
