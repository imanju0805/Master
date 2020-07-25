import { Component, OnInit } from "@angular/core";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx";
import { Router, ActivatedRoute } from "@angular/router";
import { Crop } from "@ionic-native/crop/ngx";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MenuController, Platform, NavController } from '@ionic/angular';
import { Location } from "@angular/common";
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: "app-upload-prescription",
  templateUrl: "./upload-prescription.page.html",
  styleUrls: ["./upload-prescription.page.scss"],
})
export class UploadPrescriptionPage implements OnInit {
  imageArray: Array<any> = [];
  viewPrescription: any;
  comment = "";
  respData: any;
  viewComment: any;
  showComment = false;
  enableButton = true;
  viewCom = "View";
  public medicinList: Array<any>;
  getValue = "";
  finalComment = "";
  buttonSubscribe: any;
  cropppedImage: string;
  constructor(
    private router: Router, private menu: MenuController, private location: Location,
    private camera: Camera, private storage: StorageService, private navCtrl: NavController,
    private crop: Crop, private imageResizer: ImageResizer,
    private photoViewer: PhotoViewer, private platform: Platform,
    private route: ActivatedRoute
  ) {
    let imageArrray = localStorage.getItem("prescriptions")
      ? JSON.parse(localStorage.getItem("prescriptions"))
      : [];
    this.imageArray = imageArrray;
    this.getValue = this.route.snapshot.paramMap.get("item");
    console.log(this.getValue);
    this.comment = this.getValue;
    if (this.comment == null) {
      this.comment = "";
    }
    console.log("comment ngmodel=", this.comment);

  }

  async ngOnInit() {
    await this.storage.get("comment").then(res => {
      this.comment = res;

    });
    if (this.comment == 'undefined') {
      this.comment = '';
    }

  }
  ionViewWillEnter() {
    if (this.imageArray.length > 0) {
      this.enableButton = false;
      this.showComment = true;
    }
    else {
      this.enableButton = true;
      this.showComment = false;
    }
    this.buttonSubscribe = this.platform.backButton.subscribe(async () => {
      console.log("back button click");
      this.medicinList = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];


      if (this.medicinList.length == 0) {

        this.navCtrl.navigateBack('/transaction/tabs/home');
      }
      else {
        this.navCtrl.navigateBack('/transaction/cart');
      }
    });
    this.menu.enable(false);
  }
  ionViewDidLeave() {
  }
  removeItem(index: number) {
    this.imageArray = this.imageArray.filter((v, i) => i != index);
    localStorage.setItem("prescriptions", JSON.stringify(this.imageArray));
    console.log("length after remove=", this.imageArray.length);
    if (this.imageArray.length == 0) {
      this.showComment = false;
      this.enableButton = true;
    }
    else {
      this.showComment = true;
      this.enableButton = false;
    }

  }

  getImages(type: number) {
    if (this.imageArray.length < 3) {
      this.openCamera(type);
    }
    let data = localStorage.getItem('prescription');
    console.log("data=", data);
  }
 
  openCamera(type: number) {
    let sourceType =
      type == 1
        ? this.camera.PictureSourceType.CAMERA
        : type == 2
          ? this.camera.PictureSourceType.PHOTOLIBRARY
          : this.camera.PictureSourceType.SAVEDPHOTOALBUM;
    const options: CameraOptions = {
      quality: 100,
      //allowEdit:true,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      
    };


    this.camera.getPicture(options).then(
      (imageData) => {
        //this.showImage(imageData);
        this.cropImage(imageData);
        },
      (err) => {
      }
    );
  }

  showImage(imageData) {

     let win: any = window;
     let localPath = win.Ionic.WebView.convertFileSrc(imageData);
   
    console.log("image path=", localPath);
    console.log("image information=", imageData);
    this.imageArray.push({ newPath: imageData, localPath: localPath });
    console.log(this.imageArray);
    localStorage.setItem("prescriptions", JSON.stringify(this.imageArray));
    this.enableButton = false;
    this.showComment = true;
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50 }).then(//open ur old code
      (newPath) => {
        let win: any = window;
        let localPath = win.Ionic.WebView.convertFileSrc(newPath.split("?")[0]);
        console.log(localPath);
        this.imageArray.push({ newPath: newPath, localPath: localPath });
        console.log(this.imageArray);
        localStorage.setItem("prescriptions", JSON.stringify(this.imageArray));
        this.enableButton = false;
        this.showComment = true;
      },
      (error) => {
      }
    );
  }

  viewPhoto(localPath) {
    console.log("loca path=", localPath);
    this.photoViewer.show(localPath);
  }

  uploadFiles() {
    console.log("entered comment=", this.comment);
    if (this.comment == '' || this.comment == null) {
      this.comment = '';
      this.storage.set("comment", this.comment);
    }

    if (this.route.snapshot.paramMap.get("status"))

      this.router.navigate(["transaction/address-selection", 2, { data: this.comment }]);
    else this.router.navigate(["transaction/prescription-confirm"]);
  }
  checkEmpty(comment) {
    console.log("final comment=", comment);
    if (comment == '' || comment == null) {
      this.comment = '';
      this.storage.set("comment", this.comment);
    }
    else {
      this.storage.set("comment", this.comment);
    }
  }
  back() {
    this.medicinList = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    if (this.medicinList.length == 0) {
      this.router.navigateByUrl('/transaction/tabs/home');
    }
    else {
      this.router.navigateByUrl('/transaction/cart');
    }

  }
  viewPrescriptionGuide() {
    this.router.navigateByUrl('/transaction/prescription-guide');
  }
  checkComment(name) {
    this.viewComment = !this.viewComment
    if (name === 'View') {
      this.viewCom = "Hide";
    }
    else {
      this.viewCom = "View";
    }

  }
}
