import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-cart-button",
  templateUrl: "./cart-button.page.html",
  styleUrls: ["./cart-button.page.scss"],
})
export class CartButtonPage implements OnInit {
  @Input() medicin: any;

  @Output() cartChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();

  @Input() addToCartButtonDisplay: boolean;

  @Input() removeButtonDisplayStatus: boolean;

  @Output() removeFromCart: EventEmitter<any> = new EventEmitter<any>();

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {

  }

  cartActions(status: boolean) {
    if (status)
      this.medicin.count < 25 ? this.medicin.count++ : this.medicin.count;
    else this.medicin.count > 0 ? this.medicin.count-- : this.medicin.count;
    this.medicin.cartStatus = false;
    this.cartChange.emit(this.medicin);
    if (this.medicin.count == 0) {
      this.medicin.count = 1;
    }
  }
  async confirmMessage() {


    const confirm = this.alertCtrl.create({
      header: 'Remove Medicene',
      message: 'Are you sure you want to remove medicene?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

            console.log('Confirm cancel');
            this.ngOnInit();
          }

        }, {
          text: 'Ok',

          handler: () => {
            this.removeFromCart.emit(this.medicin);
            console.log('Confirm ok');
          }
        }
      ]
    });
    (await confirm).present();
  }

  addToCartAction() {

    this.medicin.cartStatus = true;
    this.addToCart.emit(this.medicin);
  }

  addMore() {
    this.addToCart.emit(this.medicin);
  }

  removeItemFromCart() {
    this.confirmMessage();


  }
}
