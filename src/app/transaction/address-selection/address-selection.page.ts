import { Component, OnInit } from '@angular/core';
import { AddressSelectionService } from './address-selection.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MenuController, Platform } from '@ionic/angular';
import { NetworkService } from 'src/app/shared/services/network.service';

@Component({
  selector: 'app-address-selection',
  templateUrl: './address-selection.page.html',
  styleUrls: ['./address-selection.page.scss'],
})
export class AddressSelectionPage implements OnInit {
  custId: any;
  addressList: Array<any>;
  selectedAddress: any;
  id: string;
  notFound=false;
  enbaleButton = true;
  selectedRadioGroup: any;
  getValue = "";
  buttonSubscribe: any;
  constructor(private addressSelectionService: AddressSelectionService,
     private menu: MenuController,private networkService:NetworkService,
    private router: Router, private storageService: StorageService, private platform: Platform,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get("uploadType");
    this.getValue = this.route.snapshot.paramMap.get("data");
    console.log("data coming from upload prescription=", this.getValue);
    if (this.getValue == '' || this.getValue === null) {
      this.getValue = '';
      console.log("empty or null=", this.getValue);
    }


  }

  public checkDefault(user): boolean {
    let length = this.addressList.length;
    console.log("no of addresses=", length);
    if (length == 1) {
      return true;
    }
    else {
      return false;
    }
  }

  async ngOnInit() {
    await this.storageService.getObject('userData').then(res=>{
      this.custId=res.custId;
    })
    this.showAddressList();
  }
  showAddressList() {
    this.storageService.getObject('userData').then(res => {
      this.custId = res.custId;
      this.addressSelectionService.getCustomerAddressList(this.custId).subscribe((res: any) => {
        console.log(res);
        this.addressList = res;
        let length = this.addressList.length;
        console.log("no of addresses=", length);
        if (length == 1) {

        }
      })
    }
    )
  }
  ionViewWillEnter() {//did u changed here anything?
    console.log("working...");
    console.log("comment=", this.getValue);

    this.showAddressList();
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {
      console.log("Account hardware back button pressed");
      let imageArray = [];
      imageArray = localStorage.getItem("prescriptions")
        ? JSON.parse(localStorage.getItem("prescriptions"))
        : [];
      console.log("no of prescription=", imageArray.length);
      if (imageArray.length == 0) {
        this.router.navigate(['transaction/cart']);
      }
      else {
        this.router.navigate(['transaction/upload-prescription/1']);
      }
    });//this is for hardware back button code
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }
  gotoOrderSummary(selectedAddress) {
    console.log("onclick selected address=", selectedAddress);
    console.log("uploadtype=", this.id);
    let item;
    for (let i = 0; i < this.addressList.length; i++) {
      if (selectedAddress == this.addressList[i].AddressId) {
        item = this.addressList[i];
      }
    }
    console.log("id=", this.id);
    console.log("address id=", item.AddressId);
    console.log("address=", item.Address);
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.id,
        adresId: item.AddressId,
        data: item.Address,
        comment: this.getValue
      }
    };
    this.router.navigate(['/transaction/order-summary'], navigationExtras);

  }
  back() {
    let imageArray = [];
    imageArray = localStorage.getItem("prescriptions")
      ? JSON.parse(localStorage.getItem("prescriptions"))
      : [];
    console.log("no of prescription=", imageArray.length);
    if (imageArray.length == 0) {
      this.router.navigate(['transaction/cart']);
    }
    else {
      this.router.navigate(['transaction/upload-prescription/1']);
    }

  }
  selectAddress(address) {
    console.log("selected address=", address);
    this.networkService.getMerchant(this.custId,address.GEOLat,address.GEOLng).subscribe(res=>{
      let data=JSON.parse(res['_body']);
      if(data.length>0){
        this.enbaleButton = false;
        this.notFound=false;
      }
      else{
        this.notFound=true;
        this.enbaleButton = true;
      }
    })
   
  }
  addAddress() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: 1,
      }
    };
    this.router.navigate(['/entry/location'], navigationExtras);
  }

}
