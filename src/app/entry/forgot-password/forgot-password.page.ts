import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, Platform, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  timeLeft: number = 10;
  interval;
  displayNum = false;
  mobile: any;
  hideElement = false;
  otpNumber: String;
  inputDisabled = false;
  otpButtonDisabled = true;
  errorMessage = false;
  otpErrorMessage = false;
  timerDisable = false;
  myForm: FormGroup
  otpForm: FormGroup
  item: String;
  inputReadOnly = false;
  otpNumberDisable = false;
  resendOtpDisable: boolean;
  subscribe: any;
  mobileNumber: any;
  constructor(private menu: MenuController, private formBuilder: FormBuilder, private platform: Platform,
    private router: Router, private toastController: ToastController,) {

    this.myForm = this.formBuilder.group({
      mob: ['', Validators.compose([Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10),
      Validators.required])],
    });
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.compose([Validators.pattern('^[0-9]*$'),
      Validators.required])],
    })

  }
  get mob() {
    return this.myForm.get('mob');
  }
  get otp() {
    return this.otpForm.get('otp');
  }
  public validation_messages = {
    'mob': [
      { type: 'required', message: '' },
      { type: 'maxLength', message: 'mobile number must have valid 10 digit.' },

      { type: 'minLength', message: 'mobile number must have 10 digit.' },
      { type: 'pattern', message: 'can have only digit.' }

    ],
    'otp': [
      { type: 'required', message: '' },

    ],
  }

  ngOnInit() {

  }
  ionViewWillEnter() {
    this.menu.enable(false);
  }

  showOtp(mobile) {
    this.item = mobile;
    console.log("length=", mobile.length);
    if (!this.myForm.valid) {
      console.log("working---");
      this.errorMessage = true;
      this.displayNum = false;
      this.otpNumberDisable = false;
      this.otpButtonDisabled = true;
    } else {
      if (mobile.length == 10) {
        this.errorMessage = false;
      }
    }
  }

  validateMobile() {

    this.mobileNumber = this.myForm.value.mob;
    this.otpNumberDisable = true;
    this.otpButtonDisabled = false;
    this.displayNum = true;
    this.displayMessage("otp sent to your register mobile");

  }
  validateOtp() {

    console.log("working..");
    if (this.otpForm.value.otp == 123456) {
      this.displayMessage("otp success");
      this.otpForm.reset();
      this.presentPasswordModal();
    }
    else {
      this.displayMessage("invalid otp");
    }

  }
  sendOtp(event) {
    console.log("length===", event);
    this.item = event;
    this.otpErrorMessage = true;
    if (event == "" || event == null) {
      this.otpErrorMessage = true;
    }
    else if (this.item.toString().length == 6) {
      this.otpErrorMessage = false;
    }
    else {
      this.otpErrorMessage = true;
    }
  }
  async resendOtp() {

    this.displayMessage("otp sent to your register mobile");
    this.otpForm.reset();
  }
  async displayMessage(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }
  presentPasswordModal() {
    this.myForm.reset();
    this.router.navigateByUrl('/change-password');
  }


  slidePage() {
    this.router.navigateByUrl('/entry/login');
  }

}
