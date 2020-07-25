
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AccountService } from '../tabs/account/account.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  buttonSubscribe: any;
  custId: any;
  custName: any;
  myFormPassword:FormGroup
  constructor(
    private menu: MenuController, public formBuilder: FormBuilder, private storage: StorageService, private account: AccountService,
    public loadingCtrl: LoadingController, private platform: Platform, private router: Router, public toastController: ToastController,
    public toastCtrl: ToastController
  ) {
    this.myFormPassword = this.formBuilder.group({
      customerId: [''],
      oldPwd: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30),
      Validators.pattern(''), Validators.required])],
      newPwd: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30),
      Validators.pattern(''), Validators.required])],
      confPwd: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(30),
        Validators.pattern(''), Validators.required])]},
       { validator: this.checkPasswords });
  

  }
  myForm = this.formBuilder.group({
    customerId: [''],
    name: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(20),
    Validators.pattern('[A-Za-z ]{1,32}'), Validators.required])],
    email: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(50),
    Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{3,}'), Validators.required])]
  });
  
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.controls.newPwd.value;
  let confirmPass = group.controls.confPwd.value;

  return pass === confirmPass ? null : { notSame: true }
}
  get name() {
    return this.myForm.get('name');
  }
  get email() {
    return this.myForm.get('email');
  }
  get oldPwd() {
    return this.myFormPassword.get('oldPwd');
  }
  get newPwd() {
    return this.myFormPassword.get('newPwd');
  }
  get confPwd() {
    return this.myFormPassword.get('confPwd');
  }


  async ngOnInit() {
    await this.storage.getObject('userData').then(res => {
      this.custId = res.custId;
    })
    await this.storage.get('userName').then(res => {
      this.custName = res;
    })
  }
  public validation_messages = {
    'oldPwd': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'atleast 4 character it have.' },
      { type: 'maxlength', message: 'should not contain more then 20 characters.' },
    ],
    'newPwd': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'atleast 4 character it have.' },
      { type: 'maxlength', message: 'should not contain more then 20 characters.' },
      { type: 'pattern', message: 'password should have atleast one upper,one lower,special character and numbers.' }
    ],
    'confPwd': [
      { type: 'required', message: '' },
     // { type: 'minlength', message: 'atleast 4 character it have.' },
     // { type: 'maxlength', message: 'should not contain more then 20 characters.' },
      //{ type: 'pattern', message: 'password should have atleast one upper,one lower,special character and numbers.' }
    ],
    'name': [
      { type: 'required', message: 'name is required' },
      { type: 'minLength', message: 'atleast 3 characters it have' },
      { type: 'maxLength', message: 'should not contain more then 20 characters.' },
    ],
    'email': [
      { type: 'required', message: 'email is required' },
      { type: 'maxLength', message: 'should not contain more then 20 characters.' },
      { type: 'pattern', message: 'valid email required (eg:somename@gmail.com' }
    ]

  }
  async submitPass() {
    this.myFormPassword.controls.customerId.setValue(this.custId);
    console.log("form values=", this.myFormPassword.value);
    if (this.newPwd.value == this.confPwd.value) {
      console.log("Both are match...");
      this.account.changePassword(this.myFormPassword.value).subscribe(res => {
        let data = JSON.parse(res['_body']);
        console.log("response", data);
        if (data == 1) {
          this.showToast("Password Changed successfully.");
          this.myFormPassword.reset();
          this.router.navigateByUrl('transaction/tabs/account');


        }
        else {
          this.showToast("old password is incorrect");
        }
      })

    }
    else {
      this.showToast('new Password and confirm Password mismatch.');
    }
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {
      console.log('Another handler was called!');

      this.router.navigate(["/transaction/tabs/account"]);
    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }
  async showToast(mesg) {
    const toast = await this.toastController.create({

      message: mesg,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }
  back(){
    this.router.navigateByUrl('/transaction/tabs/account');
  }

  async sendData() {
    // this.myForm.controls.set
    this.storage.set('userName', this.custName);
    this.myForm.controls.customerId.setValue(this.custId);
    console.log("form values=", this.myForm.value);
    this.account.editProfile(this.myForm.value).subscribe(res => {
      let data = JSON.parse(res['_body']);
      console.log("response=", data);
      if (data == 1) {
        this.router.navigateByUrl('/transaction/tabs/account');
      }
    })

    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        cssClass: 'bg-profile',
        message: 'Your Data has been Saved',
        duration: 3000,
        position: 'bottom'
      });

      toast.present();

    });
  }

}
