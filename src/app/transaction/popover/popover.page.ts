
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  newLat: any;
  enbaleCurrentPosition = true;
  newLng: any;
  long: string;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;
  currentPosition: string;
  constructor(private modal: ModalController, private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, private platform: Platform,
    public zone: NgZone,
  ) {

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

  }

  ngOnInit() {
    this.loadMap()
  }
  dismiss() {
    this.modal.dismiss(null);
  }
  async loadMap() {

    await this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.currentPosition = resp.coords.latitude + ' ' + resp.coords.longitude;

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getCurrentPossition() {
    this.modal.dismiss(this.currentPosition);
  }
  getAddressFromCoords(lattitude, longitude) {
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
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }


  ShowCords() {

  }

  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
            this.enbaleCurrentPosition = false;
          });
        });
      });
  }

  SelectSearchResult(item) {
    console.log("item=", item);
    this.placeid = item.place_id
    let data = item.description
    this.forwardGeocode(data);
  }

  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
    this.enbaleCurrentPosition = true;
  }

  GoTo() {
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
  }

  forwardGeocode(address) {

    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.zone.run(() => {
          this.newLat = results[0].geometry.location.lat();
          this.newLng = results[0].geometry.location.lng();
          let data = this.newLat + ' ' + this.newLng;
          this.modal.dismiss(data);
        })
      } else {
        alert('Error - ' + results + ' & Status - ' + status)
      }
    });

  }

}


