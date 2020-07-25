import { Component, OnInit } from "@angular/core";
import { UploadPrescriptionService } from "../upload-prescription/upload-prescription.service";
import { SearchPage } from "../../shared/components/search/search.page";
import { ModalController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-prescription-confirm",
  templateUrl: "./prescription-confirm.page.html",
  styleUrls: ["./prescription-confirm.page.scss"],
})
export class PrescriptionConfirmPage implements OnInit {
  imageArray: Array<any> = [];
  type:any;
  constructor(
    private uploadPriscription: UploadPrescriptionService,
    private modalController: ModalController,
    private router: Router
  ) {
    let imageArrray = localStorage.getItem("prescriptions")
      ? JSON.parse(localStorage.getItem("prescriptions"))
      : [];
    this.imageArray = imageArrray;
  }

  ngOnInit() {}

  

  get medicinCount() {
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }


  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
    });
    modal.onDidDismiss().then((res) => {
      let data = res.data;
      if (data.status) this.router.navigate(["transaction/cart"]);
    });
    return await modal.present();
  }

  confirmPrescriptions(){
    this.router.navigate(["transaction/address-selection",this.type]);
  }

}


