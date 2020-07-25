import { Component, OnInit } from '@angular/core';
import { MenuController, ToastController, AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { OtpService } from 'src/app/shared/services/otp.service';
import { CustomValidationService } from 'src/app/shared/services/custom-validation.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.page.html',
  styleUrls: ['./mobile-verification.page.scss'],
})
export class MobileVerificationPage implements OnInit {
  timeLeft: number = 30;
  interval;
  timerDisable = false;
  resendOtpDisable: boolean;
  otpDisable = true;
  fabButton = true;
  result: any;
  checkedItems = []
  otpNumber: String;
  iconDisabled = true;
  myForm: FormGroup
  hide = 0;
  otpReceived: any;
  custId: any;
  inputReadOnly = false;
  otpResult: any;
  inputDisable = false;
  errorMessage = false;
  otpNumberDisable = false;
  mobile: any;
  option: any;
  question = {
    options: ["Please Verified me"]
  }
  showVerified = false;
  btnDisable = true;
  constructor(private menu: MenuController,private document: DocumentViewer,private alertController:AlertController,
     private formBuilder: FormBuilder, private otpService: OtpService, private storage: StorageService,
    private router: Router, private dialogs: Dialogs, private toastController: ToastController,) {
    this.myForm = this.formBuilder.group({
      mob: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.required, CustomValidationService.checkLimit(1000000000, 9999999999)])],
      otp: ['', Validators.compose([Validators.pattern('^[0-9]*$'), CustomValidationService.checkLimit(100000, 999999),
      Validators.required])],


    });
  }
  get mob() {
    return this.myForm.get('mob');
  }
  get otp() {
    return this.myForm.get('otp');
  }
  public validation_messages = {
    'mob': [
      { type: 'required', message: 'Please enter your Mobile Number!.' },
      { type: 'pattern', message: 'can have only digit.' }

    ],
    'otp': [
      { type: 'required', message: 'otp is required.' },
      { type: 'pattern', message: 'otp must have only digit' }

    ],
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.menu.enable(false);
  }
  slidePage() {
    this.router.navigateByUrl('/entry/welcome');
  }
  async sendOtp() {
    this.iconDisabled = true;
    if (this.myForm.value.mob == "" || this.myForm.value.mob == null) {
      const toast = await this.toastController.create({
        message: 'Please enter mobile number it cannot be empty',
        position: 'top',
        duration: 3000
       
      });
      toast.present();
    }
    else {
      this.inputReadOnly = true;
      this.otpService.postData(this.myForm.value.mob).subscribe(res => {
        this.result = JSON.parse(res['_body']);
        console.log("custID =", JSON.parse(res['_body']));
        if (this.result == 0) {
          this.presentAlertConfirm();
          //this.displayMessage("Number already exist");//what u want here  alert box background dont edit anything until click on ok button then use alert box
        }
        else {
          this.custId=this.result;
          this.otpDisable = false;
          this.displayOtpMessage("Otp sent to your registered mobile number");
          this.showVerified = true;
          this.resendOtpDisable = false;
          this.timerDisable = true;
          this.startTimer();
        }
      })

    }

  }
  async displayMessage(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'middle',
      cssClass: 'customToast',
      buttons: [
        {
          text: 'ok',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    toast.present();

  }


  
  async displayOtpMessage(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'middle',
      duration: 3000,

    });

    toast.present();

  }
  showOtp(mobile) {
    this.errorMessage = true;
    if (mobile == "" || mobile == null) {
      this.otpDisable = true;
      this.iconDisabled = true;
    }
    else if (mobile.toString().length == 10) {
      console.log("length =", mobile.toString().length);
      this.inputDisable = true;
      this.iconDisabled = false;
      this.errorMessage = false;
    }
    else {
      this.iconDisabled = true;
      this.otpDisable = true;
    }


  }
  onChange(item) {

    if (this.checkedItems.includes(item)) {
      this.checkedItems = this.checkedItems.filter((value) => value != item);
      this.fabButton = true;
    }
    else {
      this.checkedItems.push(item);
      this.fabButton = false;
    }
  }
  otpLength(otp: any) {
    console.log("length= ", otp);
    this.otpNumber = otp;
    if (otp == "" || otp == null) {
      this.otpNumberDisable = true;
      this.btnDisable = true;

    }
    else if (this.otpNumber.toString().length == 6) {
      console.log("length of otp=", this.otpNumber.toString().length);
      this.otpNumberDisable = false;
      this.btnDisable = false;
    }
    else {
      this.otpNumberDisable = true;
      this.btnDisable = true;
    }

  }

  async validateMobile() {
    this.mobile = this.myForm.value.mob;
    console.log("mobile number=", this.mobile);
    if (!this.myForm.valid) {

    }
    else {
      console.log("OTP =", this.myForm.value.otp);
      this.otpReceived = this.myForm.value.otp;
      this.otpService.createOtp(this.custId, this.otpReceived).subscribe(res => {
        console.log("result= ", JSON.parse(res['_body']));
        this.otpResult = JSON.parse(res['_body']);
        if (this.otpResult == 1) {
          this.userAlreadyExist("Verified Successfully");
          this.myForm.reset();
          let navigationExtras: NavigationExtras = {
            state: {
              data: this.mobile,
              custId:this.custId,
            }
          }
          this.router.navigateByUrl('/entry/register', navigationExtras);
        }
        else {

          this.userAlreadyExist("Invalid OTP ");
          this.otpDisable = false;
        }
      })

    }

  }

  async reSendOtp() {

    this.resendOtpDisable = false;
    if (this.myForm.value.mob == "" || this.myForm.value.mob == null) {
      const toast = await this.toastController.create({
        message: 'Please enter mobile number it cannot be empty',
        position: 'top',
        duration: 3000
      });
      toast.present();

    }
    else {
      this.otpDisable = false;
      this.inputReadOnly = true;
      this.showVerified = true;
      const toast = await this.toastController.create({

        message: 'otp has sent to your mobile number  successfully',
        position: 'top',
        duration: 3000
      });
      this.startTimer();
      toast.present();

    }

  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
  cssClass: 'my-custom-class',
      header: 'Verification Alert',
      message: 'Number Already Exist',
backdropDismiss:false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async userAlreadyExist(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }


  startTimer() {
    this.timeLeft = 30;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.resendOtpDisable = true;
        clearInterval(this.interval);
      }
    }, 1000)
  }

  viewTerms(){
    this.router.navigateByUrl('/entry/terms');
  }
  viewPlicy(){
   this.router.navigateByUrl('entry/policy');
  }

}
