import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform, ToastController, MenuController } from '@ionic/angular';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  subscribe: any;
  buttonSubscribe: any;

  constructor(public formBuilder: FormBuilder, private router: Router, private platform: Platform,
    private menu: MenuController, public toastController: ToastController) {


  }
  myFormPassword = this.formBuilder.group({
    newPass: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(20),
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d].{8,}'), Validators.required])],
    confPass: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(20),
    Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d].{8,}'), Validators.required])]
  });
  get newPass() {
    return this.myFormPassword.get('newPass');
  }
  get confPass() {
    return this.myFormPassword.get('confPass');
  }
  ngOnInit() {
  }
  public validation_messages = {
    'newPass': [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'atleast 8 character it have.' },
      { type: 'maxlength', message: 'should not contain more then 20 characters.' },
      { type: 'pattern', message: 'password should have atleast one upper,one lower,one Special character and numbers.' }
    ],
    'confPass': [
      { type: 'required', message: 'Confirm password is required.' },
      { type: 'minlength', message: 'atleast 8 character it have.' },
      { type: 'maxlength', message: 'should not contain more then 20 characters.' },
      { type: 'pattern', message: 'password should have atleast one upper,one lower,special character and numbers.' }
    ],
  }
  async submitPass() {

    console.log(this.myFormPassword.value);
    if (this.newPass.value == this.confPass.value) {
      console.log("Both are match...");
      const toast = await this.toastController.create({

        message: 'new PAssword and confirm Password matched successfully.',
        position: 'middle',
        duration: 3000
      });
      toast.present();

      this.router.navigateByUrl('/entry/login');


    }
    else {
      const toast = await this.toastController.create({

        message: 'new Password and confirm Password mismatch.',
        position: 'middle',
        duration: 2000
      });
      toast.present();
    }
  }
  backToLogin() {
    this.router.navigateByUrl('/transaction/tabs/account');
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {
      console.log('Another handler was called!');
      this.router.navigate(["/transaction/tabs/wallet/home"]);
    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }


}
