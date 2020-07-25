import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { OrderService } from 'src/app/shared/services/order.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.page.html',
  styleUrls: ['./prescription.page.scss'],
})
export class PrescriptionPage implements OnInit {
  public navParams = new NavParams
  res: any;
  data;
  orderid;
  respData: any;
  constructor(private modalCtrl: ModalController, private orderService: OrderService, private photoViewer: PhotoViewer) {
    this.data = this.navParams.get('data');
    this.orderid = this.navParams.get('orderid');
    console.log("orderid =", this.orderid);
    console.log("value =", this.data);
  }

  ngOnInit() {
    this.orderService.getPrescriptionImage(this.orderid, this.data).subscribe(res => {
      console.log("response Data =", res.url);
      this.respData = res.url;

    })
  }
  dismis() {
    console.log("working--");
    this.modalCtrl.dismiss();
  }
  viewPhoto() {
    console.log("respons ddata=", this.respData);
    this.photoViewer.show(this.respData);
  }
}
