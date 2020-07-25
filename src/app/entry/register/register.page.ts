import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NavController,
  AlertController,
  ToastController,
  MenuController,
  LoadingController,
  Platform,
} from "@ionic/angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
  CheckboxRequiredValidator,
} from "@angular/forms";
import { AuthenticationService } from "src/app/shared/services/authentication.service";
import { StorageService } from "src/app/shared/services/storage.service";
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})


export class RegisterPage implements OnInit {
  myform: FormGroup;
  submitted = false;
  readOnlyField=false;
  passwordIcon: string = "eye-off";
  option:any;
  postData = {
    custId: "",
    UserName: "",
    password: "",
    
    confirmpassword: "",
    FirstName: "",
    MiddleName: "",
    Email: "",
    LastName: "",
    MobNo:"",
  };
  showRegister=true;
  question = {
    options: ["You are agree to our terms and condition and legal policy"]
  }
  result: any;
  registerSuccess: boolean;
  customer: any;
  custId: any;
  mobile: any;
  checkedItems = []
  showSignUp=true;
  passwordType: string = "password";
  error_messages = {
    'password': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password have minimum 4 characters.' },
      //{ type: 'maxlength', message: 'password length.' }
    ],
    'confirmpassword': [
      { type: 'required', message: 'confirm password is required.' },
      { type: 'minlength', message: 'confirm password have minimum 4 characters.' },
      //{ type: 'maxlength', message: 'password length.' },
    ],
  }
  cId: any;
  subscribe: any;

  constructor(
    public formBuilder: FormBuilder,
    public loadingController: LoadingController,
    private route: Router,
    private authService: AuthenticationService,
    private toastController: ToastController,
    private storage: StorageService,
    private activateRouter: ActivatedRoute,
    private router: Router,private alertController: AlertController,
    public nav: NavController,private platform:Platform,
    public forgotCtrl: AlertController,
    public menu: MenuController,private appMinimize: AppMinimize,
    public toastCtrl: ToastController
  ) {
    
  
    this.activateRouter.queryParams.subscribe((params) => {
      if (this.route.getCurrentNavigation().extras.state) {
        this.mobile = this.route.getCurrentNavigation().extras.state.data;
        this.cId = this.route.getCurrentNavigation().extras.state.custId;
        console.log("Mobile number=", this.mobile+' and cust id=',this.cId);
      }
    });
   
    this.myform = this.formBuilder.group({
      custId: [''],
      UserName: ["", [Validators.required]],
     password:['',[Validators.required,
     Validators.minLength(4),
     Validators.maxLength(30)]],
      confirmpassword:['',[Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)]],
      FirstName: ["", [Validators.required]],//its correct only right yes then why sir said dont know what he said ask once again he said firstName only mondatory
      MiddleName: [""],
      LastName: [""],
      Email:[''],
      cb:[false,Validators.requiredTrue],
     // Email:["",[Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}")]],
     // Email: ["", [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
     MobNo: [""],
     
    }, { validator: this.checkPasswords }
    );
  }
  onChange(item) {
  
    if (this.checkedItems.includes(item)) {
      this.checkedItems = this.checkedItems.filter((value) => value != item);
      this.showRegister=true;
      this.readOnlyField=false;
    }
    else {
      
      this.checkedItems.push(item);
      this.showRegister=false;
      this.readOnlyField=true;
    }
}
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.controls.password.value;
  let confirmPass = group.controls.confirmpassword.value;

  return pass === confirmPass ? null : { notSame: true }
}
  get UserName(){
    return this.myform.get('UserName');
  }
  get confirmpassword(){
    return this.myform.get('confirmpassword');
  }
  get password(){
    return this.myform.get('password');
  }
  get cb(){
    return this.myform.get('cb');
  }
  
  get FirstName(){
    return this.myform.get('FirstName');
  }
  get MiddleName(){
    return this.myform.get('MiddleName');
  }
  get LastName(){
    return this.myform.get('LastName');
  }
  get Email(){
    return this.myform.get('Email');
  }
  get MobNo(){
    return this.myform.get('MobNo');
  }

  hideShowPassword() {
    console.log("clickked");
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }
  public validation_messages = {
    'UserName': [
        { type: 'required', message: 'User Name is required' },
        //{type:'minlength',message:'user name must have atleast 3 characters.'},
        //{ type: 'maxlength', message: 'user name cannot be more then 20 letters.'},
       // {type:'pattern',message:'can have alphanumeric characters.'}
    
      ],
    'password': [
        { type: 'required', message: 'password is required' },
        { type: 'minlength', message: 'password must contain atleast 4 letters.' },
       // {type:'pattern',message:'password must have atleast one upper,one lower , one special (@$!%*?&) character and numbers.'}
    
      ],
      'confirmpassword': [
        { type: 'required', message: '' },
       // {type:'minlength',message:'confirm password must contain atleast 6 characters.'},
        //{ type: 'maxlength', message: 'user name cannot be more then 20 letters.'},
       // {type:'pattern',message:'can have alphanumeric characters.'}
    
      ],
      'cb':[{type:'required',message:'Field is required to check'}],
      'FirstName':[
        {type:'required',message:'First Name is required'},
        //{type:'minlength',message:'Otp must have valid 6 digit.'}
      ],
      'MobNo':[
        {type:'required',message:'mobile required'}
      ]
    }

  ngOnInit() {
    this.postData.UserName=this.mobile;
    //this.postData.UserName="867868768687687";
    this.myform.controls.custId.setValue(this.cId);
    this.postData.MobNo=this.mobile;
    this.myform.controls.MobNo.setValue(this.mobile);
    console.log("mobile=",this.postData.MobNo);
  }

  ionViewWillEnter(){
    this.menu.enable(false);
   this.subscribe= this.platform.backButton.subscribeWithPriority(10,() => {
      if (this.route.url === '/entry/register') {
        this.router.navigateByUrl('/entry/welcome')
      }

    })
  }
  ionViewDidLeave() {
    this.subscribe.unsubscribe();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      translucent: true,
      message: "loading",
      duration: 500,
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log("Loading dismissed!");
  }
  checkBox(){
    if(!this.myform.valid){
      this.showSignUp=true;
    }
    else{
      this.showSignUp=false;
    }
  }
  async prosesRegister() {
    if (!this.myform.valid) {
      this.showSignUp=true;
    } 
    else {
      this.showSignUp=false;
      console.log("form data=",this.myform.value);
        if(this.myform.controls['password'].value===this.myform.controls['confirmpassword'].value){
        console.log("login data = ", this.myform.value);
        this.authService.custoRegister(this.myform.value).subscribe(
          (res) => {
            console.log(res);
            console.log(res["_body"]);
            this.result = res;
            console.log("Response =", this.result);
            if (this.result == "-1") {
              this.showRegFailed();
              this.registerSuccess = false;
              this.authService.authenticationState.next(false);
              this.route.navigate(["/entry/register"]);

            } else {
              this.myform.reset();
              this.presentLoading();
              this.presentAlertConfirm();
          
            }
          } 
        );
     
        }
        else{
          this.userAlreadyExist('passowrd and confirm password mismatch');
        }
    }
  }

  async userAlreadyExist(mesg) {
    const toast = await this.toastController.create({
      message: mesg,
      position: "top",
      duration: 3000,
    });
    toast.present();
  }

  async showRegFailed() {
    const toast = await this.toastController.create({
      message: "UserName already Exist try with different",
      position: "top",
      cssClass: "my-custom-class",
      duration: 2000,
    });
    toast.present();
  }
  login(){
    this.router.navigateByUrl('entry/login');
  }
  // async showSuccess() {
  //   const toast = await this.toastController.create({
  //     message: "User Successfully Registered Login now",
  //     position: "middle",
  //     cssClass: 'customToast',

  //     buttons: [{
  //       side: 'end',
  //       text: 'Login',
  //       handler: () => {
  //         console.log('Favorite clicked');
  //         this.route.navigate(["/entry/login"]);
  //       }

  //     }]
  //   });
  //   toast.present();
  // }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
  cssClass: 'my-custom-class',
      header: 'Success',
      message: 'User Successfully Registered Login now',
backdropDismiss:false,
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.route.navigate(["/entry/login"]);
          }
        }
      ]
    });

    await alert.present();
  }
  viewTerms(){
    this.router.navigateByUrl('entry/terms');
  }
  viewPlicy(){
    this.router.navigateByUrl('entry/policy');
  }
}
