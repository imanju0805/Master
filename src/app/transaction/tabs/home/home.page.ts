import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ModalController, MenuController, Platform, LoadingController, AlertController, ActionSheetController } from "@ionic/angular";
import { PopoverPage } from 'src/app/transaction/popover/popover.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { Router, NavigationEnd } from "@angular/router";
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { SearchPage } from 'src/app/shared/components/search/search.page';
import { NetworkService } from 'src/app/shared/services/network.service';
declare var google;
@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map:any;
  respData: any;
  address: string;
  custId: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  imageArray: Array<any> = [];
  enbaleCard = true;
  subscription: any;
  lastOrder: any;
  curentGeoLat: any;
  txtValue: any;
  confirmEnable = true;
  showForm = false;
  hideConfirm = true;
  userValue: String;
  showOther = true;
  enterOther = false;
  result: any;
  currentGeoLang: any;
  isShow = false;
  enableAddress: boolean;
  enableSearch: boolean;
  showCard = false;
  subscribe: any;
  currentPosition: string;
  lat: string;
  long: string;
  merchList: any;
  categoryList: any;
  constructor(
    private modalController: ModalController,private geolocation: Geolocation, private alertCtrl: AlertController, public actionSheetController: ActionSheetController,
    private nativeGeocoder: NativeGeocoder,private network:NetworkService,
    private loadingCtrl:LoadingController, private platform: Platform, private appMinimize: AppMinimize,
    private router: Router, private storage: StorageService, private order: OrderService, private menu: MenuController
  ) {

    this.platform.backButton.subscribe(() => {
      if (this.router.url === '/transaction/tabs/home') {
        this.appMinimize.minimize();
      }

    })
  }


  async ngOnInit() {
    this.getCategory();
    // this.loading();
    await this.storage.getObject('userData').then(res => {
      this.order.getProfileImage(res.custId).subscribe(res => {
        console.log("response Data =", res.url);
        this.storage.setProfilePic('profileImage', res.url).then(() => {
          this.storage.getProfilePic('profileImage').then(result => {
            this.respData = result;
          })
        })
      })
    })
    this.getLastorder();
  }


  getCategory(){
    this.network.getCategory().subscribe(result => {
      console.log(result['_body']);
   this.categoryList = JSON.parse(result['_body']);
   console.log("category is=",this.categoryList);
  })
  
  }
  // async loading(){
  //   const loader = await this.loadingCtrl.create({
  //     duration: 2000,
  //     translucent: true,
  //     cssClass: 'my-custom-class',
  //     showBackdrop:false
  //   });
  
  //   loader.present();
  //   loader.onWillDismiss().then(async l => {
      
  //   });
  //   }
  ionViewWillEnter() {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url == '/transaction/tabs/home') {
        this.ionViewWillEnter();
      }
    });
    this.enbaleCard = true;
    this.menu.enable(true);
    this.storage.getProfilePic('profileImage').then(result => {
      this.respData = result;
    })

  }

  uploadPrescription() {
    this.router.navigate(['transaction/upload-prescription', 0])
  }

  async getLastorder() {
    await this.storage.getObject('userData').then(res => {
      if (res) {
        this.custId = res.custId;
      }
    })
    this.order.getLastorder(this.custId).subscribe(res => {
      let data = JSON.parse(res['_body']);
      this.lastOrder = data;
      console.log("last Order=", data.ordId);
      if (data.ordId == 0) {
        this.showCard = true;
      }
    })


  }


  changeAddress() {
    this.enableSearch = !this.enableSearch;
  }


  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: PopoverPage,
  //     cssClass: 'customModal'
  //   });
  //   modal.onDidDismiss()
  //     .then((data) => {
  //       this.hideConfirm = true;
  //       this.showForm = false;
  //       if (data) {

  //         let userData = data['data'];
  //         console.log("data=", userData);
  //         if (userData == null) {
  //           userData = '';
  //         }
  //         else {
  //           this.userValue = userData;
  //           let item1 = this.userValue.toString().substr(0, this.userValue.toString().indexOf(' '));
  //           let item2 = this.userValue.toString().substr(this.userValue.toString().indexOf(' ') + 1);

  //           console.log("item1=", item1);
  //           console.log("item2", item2);
  //           let lat = parseFloat(item1);
  //           let lang = parseFloat(item2);
  //           this.loadMapFromModal(lat, lang);
  //           this.getMerchant();
  //         }
  //       }
  //     });
  //   return await modal.present();
  // }
  // loadMapFromModal(lat, lang) {
  //   let latLng = new google.maps.LatLng(lat, lang);
  //   let mapOptions = {
  //     center: latLng,
  //     zoom: 17,
  //     mapTypeId: google.maps.MapTypeId.ROADMAP
  //   }
  //   const marker = new google.maps.Marker({
  //     position: latLng,
  //     map: this.map,
  //     backgroundColor: '#004a8e',
  //   });
  //   this.getAddressFromCoords(lat, lang);
  //   this.curentGeoLat = lat;
  //   this.currentGeoLang = lang;
  //   console.log("current latitude", this.curentGeoLat);
  //   console.log("current langitude", this.currentGeoLang);
  //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  //   var infowindow = new google.maps.InfoWindow({
  //     content: `<div><label style='font-size:12px;font-weight:bold;color:#004a8e'>Your medicine will be delivered here</label>
  //     <p style='font-size:10px;color:#004a8e;font-weight:bold'>Please place the pin accurately on the map</p></div>`,

  //   });
  //   this.map.addListener('tilesloaded', () => {
  //     console.log('accuracy', this.map);
  //     this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())

  //   });
  //   infowindow.setPosition(latLng);
  //   infowindow.open(this.map);

  //   google.maps.event.addListener(this.map, 'drag', function () {
  //     marker.setPosition(this.getCenter());
  //     if (infowindow) {
  //       infowindow.close();
  //     }

  //   });

  //   google.maps.event.addListener(this.map, 'dragend', function () {
  //     marker.setPosition(this.getCenter());
  //     if (infowindow) {
  //       infowindow.close();
  //     }
  //   });
  // }
  // getAddressFromCoords(lattitude, longitude) {
  //   this.curentGeoLat = lattitude;
  //   this.currentGeoLang = longitude;

  //   console.log("getAddressFromCoords " + lattitude + " " + longitude);
  //   let options: NativeGeocoderOptions = {
  //     useLocale: true,
  //     maxResults: 5
  //   };

  //   this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
  //     .then((result: NativeGeocoderResult[]) => {
  //       this.address = "";
  //       let responseAddress = [];
  //       for (let [key, value] of Object.entries(result[0])) {
  //         if (value.length > 0)
  //           responseAddress.push(value);
  //       }
  //       responseAddress.reverse();
  //       for (let value of responseAddress) {
  //         this.address += value + ", ";
  //       }
  //       this.address = this.address.slice(0, -2);
  //       this.confirmEnable = false;
  //       console.log("current address=", this.address);
  //     })
  //     .catch((error: any) => {
  //       this.confirmEnable = true;
  //       this.address = "Address Not Available!";
  //     });

  // }
  // openAddress() {
  //   this.showForm = true;
  //   this.hideConfirm = false;
  // }


  // async loadMap() {

  //   await this.geolocation.getCurrentPosition().then((resp) => {
  //     let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
  //     let mapOptions = {
  //       center: latLng,
  //       zoom: 16,
  //       mapTypeId: google.maps.MapTypeId.ROADMAP
  //     }
  //     this.currentPosition = resp.coords.latitude + ' ' + resp.coords.longitude;

  //     this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
  //     this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  //     this.map.addListener('tilesloaded', () => {
  //       console.log('accuracy', this.map, this.map.center.lat());
  //       this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
  //       this.lat = this.map.center.lat()
  //       this.long = this.map.center.lng()
  //     });
  //   }).catch((error) => {
  //     console.log('Error getting location', error);
  //   });
  // }


//   getMerchant(){
// this.network.getMerchant( this.custId,this.curentGeoLat,this.currentGeoLang).subscribe(res => {
//   this.merchList = JSON.parse(res['_body']);
// console.log("merchants are=", this.merchList);
// this.presentAlert();
// })
//   }


//  async presentAlert() {
//     if (this.merchList.length == 0) {
//       const alert = await this.alertCtrl.create({
//         // header: ' Sorry we could not find any partners',
//         subHeader: ' Sorry we could not find any partners. near by this location',
//         message:'we will be coming soon...',
//         buttons: ['OK']
//       });

//       await alert.present();
//     }
//     else{
//       const alert = await this.alertCtrl.create({
//         subHeader: 'Available Merchants Are '+ this.merchList.length,
//         message:'Near Your Place',
//         buttons: ['OK']
//       });
//       await alert.present();
//     }
//   }

  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchPage
    });
    modal.onDidDismiss().then(res => {
      let data = res.data;
      if (data && data.status) this.router.navigate(["transaction/cart"]);
    });
    return await modal.present();
  }

  profileImage() {
    this.storage.getProfilePic('profileImage').then(result => {
      if (result) {
        this.respData = result;
      }
    })

  }

  editProfile() {
    this.router.navigateByUrl('/transaction/tabs/account');
  }

  get cartCount() {
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }

  get uploadCardData() {
    return {
      message: "Upload prescription and tell us what you need. we do the rest",
      discount: 10
    }
  }
  closeCard() {
    this.enbaleCard = false;
  }


}
