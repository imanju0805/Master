import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertController, ActionSheetController, ModalController, ToastController, Platform, MenuController } from '@ionic/angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OrderService } from 'src/app/shared/services/order.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PopoverPage } from 'src/app/transaction/popover/popover.page';
import { IonBackButtonDelegate } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  map: any;
  address: string;
  myform: FormGroup;
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoAddress: string;
  OtherText: any;
  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;
  confirmEnable = true;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  isShowWork = false;
  isShowOther = false;
  CustomerId: any;
  curentGeoLat: any;
  txtValue: any;
  result: any;
  currentGeoLang: any;
  isShow = false;
  enableAddress: boolean;
  enableSearch: boolean;
  returnData: any;
  showForm = false;
  hideConfirm = true;
  userValue: String;
  showOther = true;
  enterOther = false;
  id: any;
  mobile: any;
  mobNo: any;
  buttonSubscribe: any;

  constructor(public formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private order: OrderService, private storage: StorageService,
    private geolocation: Geolocation, private alertCtrl: AlertController, public actionSheetController: ActionSheetController,
    private nativeGeocoder: NativeGeocoder, private platform: Platform, private menu: MenuController,
    private modalController: ModalController, private toastController: ToastController,
  ) {
    this.myform = this.formBuilder.group({
      AddressId: [''],
      CustomerId: [''],
      Location: [''],
      AddLabel: ['', [Validators.required]],
      Address: ['', Validators.compose([Validators.maxLength(100),
      Validators.required])],
      Landmark: [''],
      PIN: ['', [Validators.required]],
      MobNo: '',
      GEOLat: [''],
      GEOLng: ['']

    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {

        this.id = this.router.getCurrentNavigation().extras.state.id;

        console.log("Invoice  Id= ", this.id);
        this.mobile = this.router.getCurrentNavigation().extras.state.data;
        console.log("value getting from logi  page=", this.mobile);

      }
    });
  }
  


  public labelArray = [{
    id: 0,
    label: 'home',
    icon: 'home'
  },
  {
    id: 1,
    label: 'office',
    icon: 'briefcase'
  },
  {
    id: 3,
    label: 'other',
    icon: ''
  }]

  async ngOnInit() {
    await this.storage.getObject('userData').then(res => {
      if (res) {
        this.CustomerId = res.custId;
        this.mobile = res.mobNo;
        console.log("mobile number=", this.mobile);
        console.log("custb id=", this.CustomerId);
        this.myform = this.formBuilder.group({
          AddressId: [''],
          CustomerId: [this.CustomerId],
          Location: [''],
          AddLabel: [''],
          Address: ['', Validators.compose([Validators.maxLength(100),
          Validators.required])],
          Landmark: [''],
          PIN: ['', Validators.compose([Validators.minLength(3),
          Validators.required])],
          MobNo: this.mobile,
          GEOLat: '',
          GEOLng: '',

        });
      }
    })

  }
  async ionViewWillEnter() {
    this.loadMap();
    this.menu.enable(false);
 

  }


  public validation_messages = {
    'Address': [
      { type: 'required', message: 'Address is required.' },
      { type: 'maxlength', message: 'Address cannot be more then 100 letters.' },
    ],
    'PIN': [
      { type: 'required', message: 'PIN is required.' },
      { type: 'minlength', message: 'PIN must have atleast 3 characters.' }
    ],
    'MobNo': [
      { type: 'maxlength', message: 'Address cannot be more then 10 digits.' }
    ]

  }
  get Address() {
    return this.myform.get('Address');
  }
  get AddLabel() {
    return this.myform.get('AddLabel');
  }
  get PIN() {
    return this.myform.get('PIN');
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 17,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      const marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        backgroundColor: '#004a8e',
        title: 'hi awesome'
      });
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.curentGeoLat = resp.coords.latitude;
      this.currentGeoLang = resp.coords.longitude;
      console.log("current latitude", this.curentGeoLat);
      console.log("current langitude", this.currentGeoLang);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      var infowindow = new google.maps.InfoWindow({
        content: `<div><label style='font-size:12px;font-weight:bold;color:#004a8e'>Your medicine delivered here</label>
        <p style='font-size:10px;color:#004a8e;font-weight:bold'>Please place pin accurately on th map</p></div>`,


      });
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())

      });
      infowindow.setPosition(latLng);
      infowindow.open(this.map);
      google.maps.event.addListener(this.map, 'drag', function () {
        marker.setPosition(this.getCenter());
        if (infowindow) {
          infowindow.close();
        }

      });

      google.maps.event.addListener(this.map, 'dragend', function () {
        marker.setPosition(this.getCenter());
        if (infowindow) {
          infowindow.close();
        }

      });



    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    this.curentGeoLat = lattitude;
    this.currentGeoLang = longitude;

    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
        this.confirmEnable = false;
        console.log("current address=", this.address);
      })
      .catch((error: any) => {
        this.confirmEnable = true;
        this.address = "Address Not Available!";
      });

  }

  async presentAlert(value) {
    this.txtValue = value;
    if (this.txtValue == '') {
      const alert = await this.alertCtrl.create({
        header: 'Do you want to Enter Landmark??',
        subHeader: 'Easy to reach you',
        message: 'Please Enter LandMark.',
        buttons: ['OK', 'Cancel']
      });

      await alert.present();
    }
  }


  async prosesMap() {
    if (!this.myform.valid) {

    }
    else {
      console.log("form data=", this.myform.value);
      console.log("add label=", this.myform.value.AddLabel);
      console.log("cust id=", this.myform.value.CustomerId);
      this.myform.controls.Location.setValue(this.address);
      this.myform.controls.AddressId.setValue(0);
      this.myform.controls.GEOLat.setValue(this.curentGeoLat);
      this.myform.controls.GEOLng.setValue(this.currentGeoLang);
      console.log("after  location updated form data=", this.myform.value);
      if (this.myform.value.AddLabel == '' || this.myform.value.AddLabel == null) {
        this.showError("Please select you address label");
      }
      else {


        this.order.addAddress(this.myform.value).subscribe(res => {
          console.log(res['_body']);
          this.result = (JSON.parse(res['_body']));
          console.log("Response =", this.result);
        });



        this.myform.reset();
        if (this.id == 1) {
          this.router.navigate(['transaction/address-selection', 1]);
        }
        else {
          this.router.navigateByUrl('/transaction/tabs/account');
        }

      }
    }
  }


  async showError(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }


  //Start location update watch
  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    });
  }
  selectLabel(item) {

    if (item == 'Home') {
      this.isShow = true;
      this.isShowWork = false;
    }
    else if (item == 'Work') {
      this.isShow = false;
      this.isShowWork = true;
    }
    else if (item == 'Other') {
      this.isShow = false;
      this.isShowWork = false;
    }

    let data=item.charAt(0).toUpperCase()+item.slice(1)
    console.log("label=", data);
    this.myform.controls.AddLabel.setValue(data);
    console.log("after label selected=", this.myform.value);

  }
  back() {
    this.confirmMessage()
  }

  async confirmMessage() {
    const alert = await this.alertCtrl.create({
      header: 'Address not saved',
      message: 'Are you sure you want to continue without savings?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm cancel');
            this.ngOnInit();
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.showPreviousPage();
            console.log('Confirm ok');
          }
        }
      ]
    });
    await alert.present();
  }
  async showPreviousPage() {
    if (this.id == 1) {
      let comment;
      await this.storage.get('comment').then(res => {
        comment = res;
      })
      this.router.navigate(['transaction/address-selection', 1, { data: comment }]);
    } else if (this.id == 2) {
      this.router.navigateByUrl('/transaction/tabs/account');
    }
    else {
      console.log("nothing will navigate");
    }
  }
  changeAddress() {
    this.enableSearch = !this.enableSearch;
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: PopoverPage,
      cssClass: 'customModal'
    });
    modal.onDidDismiss()
      .then((data) => {
        this.hideConfirm = true;
        this.showForm = false;
        if (data) {

          let userData = data['data'];
          console.log("data=", userData);
          if (userData == null) {
            userData = '';
          }
          else {
            this.userValue = userData;
            let item1 = this.userValue.toString().substr(0, this.userValue.toString().indexOf(' '));
            let item2 = this.userValue.toString().substr(this.userValue.toString().indexOf(' ') + 1);

            console.log("item1=", item1);
            console.log("item2", item2);
            let lat = parseFloat(item1);
            let lang = parseFloat(item2);
            this.loadMapFromModal(lat, lang);
          }
        }
      });
    return await modal.present();
  }
  loadMapFromModal(lat, lang) {
    let latLng = new google.maps.LatLng(lat, lang);
    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      backgroundColor: '#004a8e',
    });
    this.getAddressFromCoords(lat, lang);
    this.curentGeoLat = lat;
    this.currentGeoLang = lang;
    console.log("current latitude", this.curentGeoLat);
    console.log("current langitude", this.currentGeoLang);
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var infowindow = new google.maps.InfoWindow({
      content: `<div><label style='font-size:12px;font-weight:bold;color:#004a8e'>Your medicine will be delivered here</label>
      <p style='font-size:10px;color:#004a8e;font-weight:bold'>Please place the pin accurately on the map</p></div>`,

    });
    this.map.addListener('tilesloaded', () => {
      console.log('accuracy', this.map);
      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())

    });
    infowindow.setPosition(latLng);
    infowindow.open(this.map);

    google.maps.event.addListener(this.map, 'drag', function () {
      marker.setPosition(this.getCenter());
      if (infowindow) {
        infowindow.close();
      }

    });

    google.maps.event.addListener(this.map, 'dragend', function () {
      marker.setPosition(this.getCenter());
      if (infowindow) {
        infowindow.close();
      }
    });
  }
  openAddress() {
    this.showForm = true;
    this.hideConfirm = false;
  }
  selectOther() {
    this.isShow = false;
    this.isShowWork = false;
    this.showOther = true;
    this.enterOther = false;
  }
  showInput() {
    this.enterOther = true;
    this.showOther = false;
    this.AddLabel.reset();
  }
  clearText(event) {
    console.log("working..");
    this.AddLabel.reset();
    this.isShowOther = false;

  }
  enableCheck(ev) {
    if (ev == '' || ev == null) {
      this.isShowOther = false;
    }
    else {
      this.isShowOther = true;
    }
  }
}
