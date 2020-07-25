import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { Router } from '@angular/router';
import { MenuController, ToastController, Platform, AlertController } from '@ionic/angular';
import { FeedbackService } from 'src/app/shared/services/feedback.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  userName:any;
  submitted = true;
  supportMessage: string;
  subscribe: any;
  postData={
    type:"Feed"
  };
  myForm:FormGroup
  merchId: any;
  uncheck=true;

  constructor(public menu:MenuController,private router:Router,   private formBuilder:FormBuilder,private storage:StorageService, public alertCtrl: AlertController,
    public toastCtrl: ToastController,private platform:Platform,private feed: FeedbackService ) {
      this.myForm = this.formBuilder.group({
        module: ['CUST'],
        cb:[false,Validators.requiredTrue], 
       // cb1:[false,Validators.requiredTrue],  
      type: ['FEED',[Validators.required]],
      feedback:['',Validators.compose([Validators.required])],
     reportBy:"",
      });
     }
     public data: any = {
      sex: 'Feedback'
    };
  
  
    onChangeHandler($event) {
      this.data.sex = $event.target.value;
    }


  
 
  slidePage(){
   
    this.router.navigateByUrl('/dashboard');
  }



//   feedBack(body){
//     this.feedback.feedback(body).subscribe(res => {
//       console.log("result= ", JSON.parse(res['_body']));
//       this.feed = JSON.parse(res['_body']);
//   });
// }




get type(){
  return this.myForm.get('type');
}
get cb(){
  return this.myForm.get('cb');
}

get feedback(){
  return this.myForm.get('feedback');
}
get reportBy(){
  return this.myForm.get('reportBy');
}
ngOnInit() {
this.storage.getObject('userData').then(result => {
  if (result != null) {
    
    this.merchId=result.custId;
    this.myForm.controls.reportBy.setValue(this.merchId);
  }
})
}
public validation_messages = {
'type': [
    { type: 'required', message: 'Type is required' },
    //{type:'minlength',message:'user name must have atleast 3 characters.'},
    

  ],
'feedback': [
    { type: 'required', message: 'Message is required' },
   // {type:'minlength',message:'feedback must have atleast 3 characters.'},
    
  ],
}

ionViewWillEnter() {
console.log("working....");
this.menu.enable(false);
//this.myForm.controls.module.setValue("MER");
}

async submit() {

this.myForm.controls.module.setValue("CUST");
console.log("form data=",this.myForm.value);

this.feed.feedback(this.myForm.value).subscribe(res=>{
 let data=JSON.parse(res['_body']);
 if(data==1){
   this.showMessage('Your FeedBack has sent successfully.');
   this.myForm.reset();
   this.router.navigateByUrl('/transaction/tabs/home');
 }
 else{
   this.showMessage('Error in sending FeedBack Contact Admin');
 }
})
}
buttonClick(value){
console.log("check value=",value);
this.myForm.controls.type.setValue(value);
this.myForm.controls.reportBy.setValue(this.merchId);
console.log("form data=",this.myForm.value);
}
async showMessage(mesg){
const toast = await this.toastCtrl.create({
  message: mesg,
  position: 'top',
  duration: 3000
});
await toast.present();
}
}
