import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { AlertController, ToastController, ModalController, Platform } from '@ionic/angular';

import { Device } from '@ionic-native/device/ngx';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OrderService } from 'src/app/shared/services/order.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { PopoverPage } from 'src/app/transaction/popover/popover.page';
declare var google;
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  isClicked = false;
  address: string;
  data = {
    GEOLat: '',
    GEOLng: '',
    Address: '',
    LandMark: '',
    MobNo: ''
  };
  userValue: String;
  isShow = false;
  isShowWork = false;
  isShowOther = false;
  showForm = false;
  hideConfirm = true;
  showOther = true;
  enterOther = false;
  custId: any;
  addId: any;
  public newArray: any;
  //address: any = {};
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoAddress: string;
  curentGeoLat: any;
  currentGeoLang: any;
  result: any;
  watchLocationUpdates: any;
  loading: any;
  token: any;
  isWatching: boolean;
  editForm: FormGroup;
  latFromApi; any;
  lngFromApi: any;
  latitudeFromGoogle: any;
  longitudeFromGoogle: any;
  confirmEnable = true;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  buttonSubscribe: any;

  constructor(private router: Router, private route: ActivatedRoute, private addressService: OrderService,
    private formBuilder: FormBuilder, private device: Device, private toastController: ToastController, private modalController: ModalController,
    private geolocation: Geolocation, private alertCtrl: AlertController, private storageService: StorageService,
    private nativeGeocoder: NativeGeocoder, private platform: Platform) {


    this.route.queryParamMap.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        this.addId = this.router.getCurrentNavigation().extras.state.addressid;
        console.log("data value=", this.data);
        console.log("addres id=", this.addId);
      }

    });
    this.editForm = this.formBuilder.group({
      AddressId: [''],
      CustomerId: [''],
      AddLabel: ['',],
      Address: ['', Validators.compose([Validators.maxLength(100),
      Validators.required])],
      Location: [''],
      LandMark: [''],
      MobNo: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.required])],
      GEOLat: [''],
      GEOLng: [''],
      PIN: [''],
      Token: [''],
      DeviceId: [device.uuid]
    })

  }

  get Address() {
    return this.editForm.get('Address');
  }
  get LandMark() {
    return this.editForm.get('LandMark');
  }
  get MobNo() {
    return this.editForm.get('MobNo');
  }
  get AddLabel() {
    return this.editForm.get('AddLabel');
  }


  public validation_messages = {
    'Address': [
      { type: 'required', message: 'Address is required.' },
      { type: 'maxlength', message: 'Address cannot be more then 100 letters.' },
    ],

    'MobNo': [
      { type: 'required', message: 'Mobile number required.' },
      { type: 'minlength', message: 'mobile number must have valid 10 digit.' },
    ]

  }
  ngOnInit() {
    this.getAllAddress();
  }

  ionViewWillEnter() {
    this.loadMap();
    console.log("inside  ionview will enter");
    console.log("data value=", this.data);
    this.getAllAddress();
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {
      console.log('Another handler was called!');
      this.router.navigate(["/transaction/tabs/account"]);

    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }
  async getAllAddress() {
    await this.storageService.getObject('userData').then(res => {
      this.custId = res.custId;
      this.token = res.token;
      console.log("token=", this.token);
      console.log("customer id=", this.custId);
    });

    this.addressService.getAddress(this.custId).subscribe(res => {
      this.result = (JSON.parse(res['_body']));
      console.log("address=", this.result);
      let item = this.result;
      for (let i = 0; i < item.length; i++) {
        console.log("address id", item[i].AddressId);
        if (this.addId == item[i].AddressId) {
          this.newArray = item[i];
          console.log("new array value=", this.newArray);
          console.log("Label=", this.newArray.AddLabel);
          this.selectLabel(this.newArray.AddLabel);
        }
      }

    })
  }

  loadMap() {
    console.log("Response latitude=", this.data.GEOLat);
    console.log("Response longitude=", this.data.GEOLng);

    this.geolocation.getCurrentPosition().then((resp) => {

      let latLng = new google.maps.LatLng(this.data.GEOLat, this.data.GEOLng);
      console.log("google latlng=", latLng);
      let mapOptions = {
        center: latLng,
        zoom: 17,
        disableDefaultUI: true,
        // mapTypeId: 'coordinate'
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      const marker = new google.maps.Marker({
        position: { lat: this.data.GEOLat, lng: this.data.GEOLng },
        map: this.map,
        animation: google.maps.Animation.DROP,
        backgroundColor: '#004a8e',
        title: 'hii awesome'
      });

      this.getAddressFromCoords(this.data.GEOLat, this.data.GEOLng);

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
      google.maps.event.addListener(marker, 'click', () => {
        if (infowindow) {
          infowindow.close();
        }

      });

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


    })

  }
  coOrdinates(lat, lang) {
    this.latitudeFromGoogle = lat;
    this.longitudeFromGoogle = lang;
  }

  getAddressFromCoords(lattitude, longitude) {
    this.curentGeoLat = lattitude;
    this.currentGeoLang = longitude;
    console.log("map listener latitude=", this.curentGeoLat);
    console.log("map listener longitude", this.currentGeoLang);
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
        console.log("chnaged address=", this.address);
      })
      .catch((error: any) => {
        this.confirmEnable = true;
        this.address = "Address Not Available!";
      });


  }

  currentLocation() {
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
        // draggable: false,
        animation: google.maps.Animation.DROP,
        backgroundColor: '#004a8e',
        title: 'hii awesome'
        //icon: icon,
      });
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.curentGeoLat = resp.coords.latitude;
      this.currentGeoLang = resp.coords.longitude;
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
      google.maps.event.addListener(marker, 'click', () => {
        if (infowindow) {
          infowindow.close();
        }

      });

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
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.curentGeoLat = resp.coords.latitude;
      this.currentGeoLang = resp.coords.longitude;
      this.getGeoencoder(this.curentGeoLat, this.currentGeoLang);
    });
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
        console.log("Geo Address=", this.geoAddress);
      })
      .catch((error: any) => {
      });
  }
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
  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.curentGeoLat = resp.coords.latitude;
      this.currentGeoLang = resp.coords.longitude;
      this.getGeoencoder(this.curentGeoLat, this.currentGeoLang);
    });
  }

  async saveAddress(item) {
    if (!this.editForm.valid) {

    }
    else {
      console.log("form data=", this.editForm.value);
      console.log("Address Id=", item.AddressId);
      console.log("geolatitude=", this.curentGeoLat);
      console.log("geo longitude=", this.currentGeoLang);
      console.log("-----------------------------------------");
      let data = item.AddressId;
      console.log("data=", data);
      this.editForm.controls.AddressId.setValue(data);
      this.editForm.controls.Location.setValue(this.address);
      this.editForm.controls.CustomerId.setValue(this.custId);
      this.editForm.controls.AddLabel.setValue(item.AddLabel);
      this.editForm.controls.GEOLat.setValue(this.curentGeoLat);
      this.editForm.controls.GEOLng.setValue(this.currentGeoLang);
      this.editForm.controls.Token.setValue(this.token);
      if (this.editForm.value.AddLabel == '' || this.editForm.value.AddLabel == null) {
        this.showError("Please select you address label");
      }
      else {
        console.log("after  location updated form data=", this.editForm.value);
        this.addressService.addAddress(this.editForm.value).subscribe(res => {
          console.log(res['_body']);
          this.result = (JSON.parse(res['_body']));
          console.log("Response =", this.result);
        });



        this.editForm.reset();
        this.router.navigateByUrl('/transaction/tabs/account');
      }
    }
  }

  back() {
    this.router.navigateByUrl('/transaction/tabs/account');
  }
  openAddress() {
    this.showForm = true;
    this.hideConfirm = false;
  }
  async presentAlert(value) {
    if (value == '') {
      const alert = await this.alertCtrl.create({
        header: 'Do you want to Enter Landmark??',
        subHeader: 'Easy to reach you',
        message: 'Please Enter LandMark.',
        buttons: ['OK', 'Cancel']
      });

      await alert.present();
    }
  }
  selectLabel(item) {

    if (item == 'home') {
      this.isShow = true;
      this.isShowWork = false;
    }
    else if (item == 'work') {
      this.isShow = false;
      this.isShowWork = true;
    }
    else if (item == 'other') {
      this.isShow = false;
      this.isShowWork = false;
    }


    console.log("label=", item);
    this.editForm.controls.AddLabel.setValue(item);
    console.log("after label selected=", this.editForm.value);

  }
  showInput() {
    this.enterOther = true;
    this.showOther = false;
    this.AddLabel.reset();
  }
  selectOther() {
    this.isShow = false;
    this.isShowWork = false;
    this.showOther = true;
    this.enterOther = false;
  }
  clearText(event) {
    console.log("working..");
    this.AddLabel.reset();
    this.isShowOther = false;

  }
  async showError(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'top',
      duration: 2000
    });
    toast.present();
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
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    const marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
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
      if (infowindow) {
        infowindow.close();
      }
    });
    infowindow.setPosition(latLng);
    infowindow.open(this.map);
    google.maps.event.addListener(marker, 'click', () => {
      if (infowindow) {
        infowindow.close();
      }

    });

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
  logScrollStart() {
    console.log("logScrollStart : When Scroll Starts");
  }

  logScrolling() {
    console.log("logScrolling : When Scrolling");
  }

  logScrollEnd() {
    console.log("logScrollEnd : When Scroll Ends");
  }

}
