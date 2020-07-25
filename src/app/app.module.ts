import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { Camera } from '@ionic-native/camera/ngx'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SharedModule } from './shared/shared.module';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { HttpModule } from '@angular/http';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { PopoverPageModule } from './transaction/popover/popover.module';
import { PrescriptionPageModule } from './transaction/prescription/prescription.module';
import { PrescriptionPage } from './transaction/prescription/prescription.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from './shared/services/network.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { HomePageModule } from './transaction/tabs/home/home.module';
import { HttpCacheInterceptorModule } from '@ngneat/cashew';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    HttpCacheInterceptorModule.forRoot(),

    IonicModule.forRoot({
      rippleEffect: false,
      mode: "md"
    }),
    AppRoutingModule,
    PrescriptionPageModule,
    PopoverPageModule,
    ReactiveFormsModule,

    BrowserAnimationsModule,
    SharedModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    FCM,
    DocumentViewer,
    AppMinimize,
    SplashScreen,
    Camera,
    Crop,
    ImageResizer,
    Dialogs,
    PhotoViewer,
    NetworkService,
    Network,
    File,
    FileOpener,
    Geolocation,
    NativeGeocoder,
    FileTransfer,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
