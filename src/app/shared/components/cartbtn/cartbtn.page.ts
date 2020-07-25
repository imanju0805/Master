import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cartbtn',
  templateUrl: './cartbtn.page.html',
  styleUrls: ['./cartbtn.page.scss'],
})
export class CartbtnPage implements OnInit {

  @Input() medicin: any;

  @Output() cartChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();

  @Input() addToCartButtonDisplay: boolean;

  @Input() removeButtonDisplayStatus: boolean;

  @Output() removeFromCart: EventEmitter<any> = new EventEmitter<any>();
  @Input() count:number;
  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {

  }

  cartActions(status: boolean) {
    if (status)
      this.medicin ? this.medicin : this.medicin;
    else this.medicin ? this.medicin : this.medicin;
    this.cartChange.emit(this.medicin);

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

   
    this.addToCart.emit(this.medicin);
  }

  addMore() {
    this.addToCart.emit(this.medicin);
  }

  removeItemFromCart() {
    this.confirmMessage();


  }
 
}
