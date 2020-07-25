import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ModalController } from '@ionic/angular';
import { StorageService } from 'src/app/shared/services/storage.service';
import { SearchPage } from 'src/app/shared/components/search/search.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  public medicinList: Array<any>;
  emptyCart = false;
  count: number;
  viewComment: any;
  comment = "";
  enableButton: boolean;
  viewCom = "View";
  openComment = false;
  buttonSubscription: any;
  constructor(private storage: StorageService, private router: Router, private modalController: ModalController,
    private menu: MenuController, private platform: Platform) {


  }

  async ngOnInit() {
    this.medicinList = [];
    this.getCartItems();
    await this.storage.get('comment').then(res => {
      this.comment = res;
    })
    if (this.comment == 'undefined') {
      this.comment = '';
    }
  }

  ionViewWillEnter() {
    console.log("working...",);
    this.menu.enable(false);
    this.buttonSubscription = this.platform.backButton.subscribe(async () => {
      console.log('Cart page back button click');
      this.router.navigate(["/transaction/tabs/home"]);
    });
  }
  ionViewDidLeave() {
    this.buttonSubscription.unsubscribe();
  }

  getCartItems() {
    this.medicinList = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    console.log("no of items=", this.medicinList);
    this.count = this.medicinList.length;
    if (this.medicinList.length == 0) {
      this.emptyCart = true;
      this.openComment = false;
    }
    else {
      this.openComment = true;

    }
  }

  removeFromCart(medicin) {

    this.medicinList = this.medicinList.filter(item => medicin.Id != item.Id);
    localStorage.setItem('cart', JSON.stringify(this.medicinList))
    this.getCartItems();

  }

  medicinCountUpdate(medicin) {
    this.medicinList = this.medicinList.map(item => {
      if (item.Id == medicin.Id)
        item = medicin;
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(this.medicinList))
  }

  goToAddressSelection() {
    console.log("entered commenet=", this.comment);
    if (this.comment == null) {
      this.comment = "";
      console.log("working=", this.comment);
    }
    let isPrescriptionRequired = this.medicinList.filter(item => (item.PresRequired && item.PresRequired == 1));
    if (isPrescriptionRequired.length > 0)
      this.router.navigate(['transaction/upload-prescription', 1, { item: this.comment }]);
    else
      this.router.navigate(['transaction/address-selection', 1, { data: this.comment }]);
  }

  uploadPrescription() {
    this.router.navigate(['transaction/upload-prescription', 1]);
  }

  get cartCount() {
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }
  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchPage
    });
    modal.onDidDismiss().then(res => {
      let data = res.data;
      if (data && data.status) this.router.navigate(["transaction/cart"]);
    });
    return await modal.present();
  }

  get uploadCardData() {
    return {
      title: "If you have  prescription",
    }
  }
  checkEmpty(comment) {

    if (comment == '' || comment == null) {
      this.enableButton = true;
      this.comment = '';
      this.storage.set("comment", this.comment);
    }
    else {
      this.enableButton = false;
      this.storage.set("comment", this.comment);
    }

  }
  checkComment(name) {
    this.viewComment = !this.viewComment
    if (name === 'View') {
      this.viewCom = "Hide";
    }
    else {
      this.viewCom = "View";
    }

  }
}
