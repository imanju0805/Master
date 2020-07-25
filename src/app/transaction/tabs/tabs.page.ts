import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Platform, IonRouterOutlet, MenuController } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  enbaleCard = true;
  respData: any;
  constructor(private storage: StorageService, private appMinimize: AppMinimize, private platform: Platform,
    private order: OrderService, private router: Router, private menu: MenuController) {

  }


  async ngOnInit() {
    await this.storage.getObject('userData').then(res => {
      this.order.getProfileImage(res.custId).subscribe(res => {
        console.log("response Data =", res.url);
        this.storage.setProfilePic('profileImage', res.url).then(() => {
          this.storage.getProfilePic('profileImage').then(result => {
            this.respData = result;
          })
        })
      })
    })
  }
  ionViewWillEnter() {
    this.menu.enable(true);
  }
  onLanguageChange(event){
    console.log("updated");
    this.respData=event;
  }
  get cartCount() {//how he has used this count i want to know
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }
  
 
  back() {
    this.router.navigateByUrl("/transaction/tabs/home");
  }
  editProfile() {
    this.router.navigateByUrl('/transaction/tabs/account');
  }
  showCartPage() {
    this.router.navigate(['/transaction/cart']);
  }
  closeCard() { }
}
