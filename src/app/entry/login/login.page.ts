import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { Device } from "@ionic-native/device/ngx";
import { LoadingController } from "@ionic/angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { FCM } from '@ionic-native/fcm/ngx';
import { OtpService } from 'src/app/shared/services/otp.service';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
const TOKEN_KEY = "user-access-token";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  result: any;
  id: any;
  uuid: any;
  userDetails: [];
  passwordIcon: string = "eye-off";
  passwordType: string = "password";
  loginSuccess: any;
  registerCredentials = { UserName: "", password: "", type: 1 };
  myForm: FormGroup;
  myOtpForm: FormGroup;
  otpEnable = false;
  passEnable = true;
  showOtpLogin = false;
  loginbtnDisable = true;
  showOtpfiled=false;
  subscribe: any;
  
  constructor(
    public menu: MenuController,
    private authService: AuthenticationService,
    private device: Device,
    public platform: Platform,
    public loadingController: LoadingController,
    public navCtrl: NavController, private otpService: OtpService,
    private formBuilder: FormBuilder,
    private route: Router, private fcm: FCM,
    public alertController: AlertController,
    private toastController: ToastController,
    private storage: StorageService,
    private appMinimize: AppMinimize,
  ) {

  
    this.uuid = this.device.uuid;
    this.myForm = this.formBuilder.group({
      UserName: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.required,
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(3), Validators.required]),
      ],
    // deviceId: this.uuid,
      deviceId:"hkjhjkyfyjf",
      FCMToken:"gfjfjh"
    });

    this.myOtpForm = this.formBuilder.group({
      mobNo: [
        "",
        Validators.compose([
          Validators.minLength(10),
          Validators.required,
        ]),
      ],
      OTP: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
    // deviceId:this.uuid,
 deviceId:'ggjggjfjfg',//wait
      FCMToken:"gfgjfjh"
    });
    this.platform.ready().then(() => {

      if (this.platform.is('android')) {
        this.fcm.getToken().then(token => {
          this.myForm.controls.FCMToken.setValue(token);
          this.myOtpForm.controls.FCMToken.setValue(token);
          console.log("fcm token inside login=", token);
          this.storage.set("fcmToken", token);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });

        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background');
            this.route.navigate([data.landing_page]);
          } else {
            console.log('Received in foreground');
          }
        });

      }
    });
  }

  get UserName() {
    return this.myForm.get("UserName");
  }
  get password() {
    return this.myForm.get("password");
  }
  get deviceId() {
    return this.myForm.get("deviceId");
  }

  get OTP() {
    return this.myOtpForm.get("OTP");
  }
  get mobNo() {
    return this.myOtpForm.get('mobNo');
  }

  public validation_messages = {
    UserName: [
      { type: "required", message: "user name is required." },
      {
        type: "minlength",
        message: "user name must have atleast 3 characters.",
      },
      {
        type: "maxlength",
        message: "user name cannot be more then 20 letters.",
      },
    ],
    password: [
      { type: "required", message: "password is required." },
      {
        type: "minlength",
        message: "password must contain atleast 3 letters.",
      },
    ],
    OTP: [
      {
        type: "required", message: "Otp is required"
      },
      { type: "minlength", message: "otp must have valid 6 digit." }
    ],
    mobNo: [
      {
        type: "required", message: "Mobile number is required"
      },
      { type: "minlength", message: "Mobile number must have valid 10 digit." }
    ]
  };
  //It will shows Device Id
  async showDeviceId(id) {
    const toast = await this.toastController.create({
      message: "Device Id=" + id,
      position: "top",
      duration: 1000,
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      message: "loading",
      duration: 1000,
      cssClass: 'my-custom-class',
     showBackdrop:false
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }

  ngOnInit() {
    if (this.loginSuccess) {
      this.storage.getObject("userData").then((res) => {
        if (res) {
          this.authService.authenticationState.next(true);
        }
      });
    }
  }
  ionViewWillEnter() {
    this.menu.enable(false);
    this.subscribe=  this.platform.backButton.subscribeWithPriority(10,() => {
      if (this.route.url === '/entry/login') {
        this.route.navigateByUrl('/entry/welcome');
      }

    })
  }
  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  //Login Validates
  async prosesLogin() {
    console.log("login data = ", this.myForm.value);
    this.authService.postData(this.myForm.value).subscribe(
      (data) => {
        console.log(data);
        console.log(data["_body"]);
        this.result = data;
        console.log("Response =", this.result.custId);
        if (this.result.custId == "0") {
          this.showToast("UserName /Password Wrong");
          this.loginSuccess = false;

        } else {
          this.presentLoading();
          let name = this.result.customerName;
          console.log("user name=", name);
          this.storage.set('userName', name);
          this.storage.setObject("userData", this.result).then(() => {
            this.loginSuccess = true;
            this.route.navigate(["transaction/tabs/home"]);
            this.authService.authenticationState.next(true);
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      duration: 2000,
    });
    toast.present();
  }
  //This will Routes to Registration Page
  signUp() {
    this.route.navigate(["entry/registration"]);
  }
  //Invisible Password
  hideShowPassword() {
    console.log("clickked");
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }
  //Routes to Reset Page
  resetPAssPAge() {
    this.route.navigateByUrl("/entry/forgot-password");
  }
  otpClick() {
    console.log("otp click");
    if(this.myForm.value){
      this.myForm.reset();
    }
    this.otpEnable = true;
    this.passEnable = false;
    this.showOtpLogin = true;
  }
  passwordClick() {
    //this.myOtpForm.controls['mobNo'].setValue('');
    //this.myOtpForm.controls['OTP'].setValue('');
    if(this.myOtpForm.value){
      this.myOtpForm.reset();
    }
    
    console.log("password click");
    this.otpEnable = false;
    this.passEnable = true;
    this.showOtpLogin = false;
  }
  otpLogin() {
    console.log("otp login data", this.myOtpForm.value);
    this.otpService.validateOtp(this.myOtpForm.value).subscribe(res => {
      let data=JSON.parse(res['_body']);
      if(data.custId==0&&data.customerName==0&& data.mobNo==0 && data.token==0){
        this.showToast('Invalid otp');
      }
      else{
        this.storage.setObject("userData",data).then(() => {
          this.loginSuccess = true;
          this.route.navigate(["transaction/tabs/home"]);
          this.authService.authenticationState.next(true);
        });

        //this.route.navigateByUrl('/transaction/tabs/home');

      }
    })
  }
  checkMobileNumber(mob) {
    
    // if(this.myOtpForm.value.mobNo.valid){
    //   this.showOtpfiled=true;
    // }
  
    
    if (mob == '' || mob == null) {
      this.loginbtnDisable = true;
      this.showOtpfiled=false;
    }
    else if ((this.myOtpForm.controls['mobNo'].value).length == 10) {
     // this.showOtpfiled=true;
      this.loginbtnDisable = false;
    }
    else {
      this.myOtpForm.controls['OTP'].setValue('');
      this.showOtpfiled=false;
      this.loginbtnDisable = true;
    }
  
  }
  sendOtp() {
    console.log("mobile number",this.myOtpForm.controls['mobNo'].value);
    let data=this.myOtpForm.controls['mobNo'].value;
    this.otpService.getOtp(data).subscribe(res=>{
      let result=JSON.parse(res['_body']);
      if(result==1){
        this.showOtpfiled=true;
        this.showToast("Otp has sent to your register Mobile Number");
      }
      else{
        this.showToast("User Does't exist register with new Customer");
      }
    })
   
  }
}
