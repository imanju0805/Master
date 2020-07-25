import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras, NavigationEnd, NavigationStart } from '@angular/router';
import { Crop } from '@ionic-native/crop/ngx';
import { ActionSheetController, ToastController, AlertController, Platform, MenuController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderService } from 'src/app/shared/services/order.service';

import { filter } from 'rxjs/operators'



@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  selectedRadioGroup: any;
  @Output() changeLangOutput= new EventEmitter();
  selectedRadioItem: any;
  fileUrl: any;
  custId: any;
  addressExist = true;
  respData: any;
  croppedImagepath: any;
  merchId: string;
  data: any;
  result: any;
  userName: any;
  idk: any;
  mobNo: any;
  subscription: any;

  constructor(private router: Router,private loadingCtrl:LoadingController,
     private platform: Platform, private menu: MenuController, private storage: StorageService, private Order: OrderService, public popoverCtrl: PopoverController, private file: File, private toastController: ToastController, private route: ActivatedRoute,
    private crop: Crop, private camera: Camera, private alertCtrl: AlertController, private transfer: FileTransfer, private actionSheetController: ActionSheetController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data;
        console.log("data= ", this.data);
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((route: NavigationStart) => {
        console.log('Route: '+route.url)
        this.fromConstructor();
    })

  }

  fromConstructor(){
    console.log("working when tab comes to account==");
    this.getAddress();
    this.getProfilePage()
  }
  async ngOnInit():Promise<void> {
    this.loading();
    this.getAddress();
    this.getProfilePage();
    await this.storage.getProfilePic('profileImage').then(result => {
      if (result) {
        this.respData = result;
      }
    })
  }
 async ionViewWillEnter():Promise<void> {
  this.subscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd && event.url == '/transaction/tabs/account}') {
    console.log("working.......");//this line of code is not showing once u add address 
    this.getAddress();
    this.menu.enable(true);
    this.getProfilePage()
  }
  });
  await this.storage.getProfilePic('profileImage').then(result => {
    if (result) {
      this.respData = result;
    }
  })
  }
  async getProfilePage() {
    await this.storage.get('userName').then(res => {
      this.userName = res;
      console.log("userName=", this.userName);
    })
    await this.storage.getObject('userData').then(res => {
      if(res!=null){
      this.custId = res.custId;

      this.mobNo = res.mobNo;
      console.log("mobile no=", this.mobNo);

      console.log("results=", res);
      }
    })
  
  }
 async loading(){
  const loader = await this.loadingCtrl.create({
    duration: 2000,
    translucent: true,
      cssClass: 'my-custom-class',
      showBackdrop:false

  });

  loader.present();
  loader.onWillDismiss().then(async l => {
    
  });
  }

  editProfilePage(){
    this.router.navigateByUrl("/transaction/edit-profile");
  }
  async getAddress() {
    await this.storage.getObject('userData').then(res => {
      if(res!=null){
      this.custId = res.custId;
      console.log("customer is=", this.custId);
      }
    })
    console.log("customer is=", this.custId);
    this.Order.getAddress(this.custId).subscribe(res => {
      this.result = (JSON.parse(res['_body']));
      console.log("address+", this.result);
    })
  }

  async presentPopover(ev: any, add) {
    console.log("address values=", add);
    const popover = await this.popoverCtrl.create({
      component: "",
      componentProps: { address: add },
      event: ev,
      translucent: false
    });
    return await popover.present();
  }



  async confirmMessage(addI) {
    const confirm = this.alertCtrl.create({
      header: 'Address Delete',
      message: 'Are you sure you want to Delete Address?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Confirm cancel');
            this.ngOnInit();
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm ok');
            let id = addI.AddressId;
            this.Order.deleteAddress(id).subscribe(res => {
              console.log(res['_body']);
            })
            this.router.navigateByUrl('/transaction/tabs/account');
            this.ionRefresh(event);
          }
        }
      ]
    });
    (await confirm).present();
  }


  back() {
    this.router.navigateByUrl("/transaction/tabs/home");
  }
  location() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: 2,
      }
    };
    this.router.navigateByUrl('/entry/location', navigationExtras);
  }
  come(item) {
    console.log("address Id value=", item.AddressId);
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
        addressid: item.AddressId
      }
    };
    this.router.navigateByUrl('/entry/edit-address', navigationExtras);
  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
     
      saveToPhotoAlbum: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.cropImage(imageData)
    }, (err) => {
      console.log("error in loading image using gallery");
    });
  }

  cropImage(fileUrl) {
    this.crop.crop(fileUrl, { quality: 50, targetHeight: 100, targetWidth: 100 })
      .then(
        newPath => {
         
          this.showCroppedImage(newPath.split('?')[0])
        },
      );
  }

  showCroppedImage(ImagePath) {
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];
    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      let base64Image = 'data:image/jpeg;base64,' + base64;
      var stringLength = base64Image.length - 'data:image/png;base64,'.length;
      var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
      var sizeInKb = sizeInBytes / 1000;
      console.log("file size = ", sizeInKb);

      this.croppedImagepath = base64;
      console.log("cropped image path =", this.croppedImagepath);

      const fileTransfer: FileTransferObject = this.transfer.create();
      const uploadOpts: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.custId + '.jpg'
      };

      console.log("file name =", uploadOpts.fileName);
      console.log("cropped IMage = ", this.croppedImagepath);
      console.log("upload options =", uploadOpts);
      if (sizeInKb > 1024) {
        console.log("Reduce the size of image");
        this.showMessage("image size is too big please upload below 1 mb");
      }
      else {
        this.storage.setProfilePic("profileImage", this.croppedImagepath);
        this.respData = this.croppedImagepath;
        this.changeLangOutput.emit(this.respData);
        this.showMessage("Profile Photo Changed Successfully");
        fileTransfer.upload(this.croppedImagepath, 'http://medv.in/medv/api/Image/uploadCustImage', uploadOpts)
          .then((data) => {
            console.log(data);
            console.log(this.respData);
          }, (err) => {
            console.log(err);
            console.log("error in loading image using gallery");
          });
      }
      this.fileUrl = this.croppedImagepath;
    }, error => {
      alert('Error in showing image' + error);
    });
  }
  get cartCount() {
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }
  back1() {
    this.router.navigateByUrl('/transaction/tabs/home');
  }

  async showMessage(resp) {
    const toast = await this.toastController.create({
      message: resp,
      position: 'middle',
      duration: 5000
    });
    toast.present();

  }
  deleteAddress(addI) {
    let id = addI.AddressId;
    this.Order.deleteAddress(id).subscribe(res => {
      console.log(res['_body']);
      this.showMessage("Address has been deleted");
    })
    this.router.navigateByUrl('/entry/profile');
    this.ionRefresh(event);
  }

  ionRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getAddress();
    }, 2000);
  }
  ionPull(event) {
    console.log('ionPull Event Triggered!');
  }
  ionStart(event) {
    console.log('ionStart Event Triggered!');
  }

  viewTerms(){
    this.router.navigateByUrl('entry/terms');
  }
  viewPlicy(){
    this.router.navigateByUrl('entry/policy');
  }
}
