import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { MenuController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.page.html',
  styleUrls: ['./order-status.page.scss'],
})
export class OrderStatusPage implements OnInit {
  count: string;
  comment: any;
  buttonSubscribe: any;

  constructor(private router: Router, private route: ActivatedRoute, private platform: Platform,
    private storage: StorageService, private menu: MenuController) {

  }

  ngOnInit() {
    console.log("merchant count=", this.marchentCount);
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscribe = this.platform.backButton.subscribe(() => {

      console.log("Account hardware back button pressed");
      this.router.navigate(['transaction/tabs/home']);

    });
  }
  ionViewDidLeave() {
    this.buttonSubscribe.unsubscribe();
  }
  async onClick() {
    await this.storage.get('comment').then(res => {
      this.comment = res;
    })
    if (this.comment == null) {
      this.comment = '';
    }
    console.log("comment=", this.comment);
    if (this.marchentCount == 0) {
      let imageArray = [];
      imageArray = localStorage.getItem("prescriptions")
        ? JSON.parse(localStorage.getItem("prescriptions"))
        : [];
      console.log("no of prescription=", imageArray.length);
      if (imageArray.length == 0) {
        this.router.navigate(['transaction/address-selection', 1, { data: this.comment }]);
      }
      else {
        this.router.navigate(['transaction/address-selection', 2, { data: this.comment }]);
      }

    }
    else {
      localStorage.removeItem("cart");
      localStorage.removeItem("prescriptions");
      this.storage.remove("comment");
      this.router.navigate(['transaction/tabs/home']);

    }
  }

  Click() {
    localStorage.removeItem("cart");
    localStorage.removeItem("prescriptions");
    this.storage.remove("comment");
    this.router.navigate(['transaction/tabs/home']);

  }

  get marchentCount() {
    return this.route.snapshot.paramMap.get("merchantCount") ? this.route.snapshot.paramMap.get("merchantCount") : 0;
  }

}
