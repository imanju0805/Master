import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NetworkService } from 'src/app/shared/services/network.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { MedicinImages } from 'src/app/shared/services/medicin-images';
import 'rxjs/Rx';
import 'rxjs/add/operator/map'
@Component({
  selector: 'app-mask',
  templateUrl: './mask.page.html',
  styleUrls: ['./mask.page.scss'],
})
export class MaskPage implements OnInit {
  @Input() medicin: any;

medicineImages = new MedicinImages().medicinImages;
 // @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();
  url="https://medv.in/medv/UserImage/ProductImage/"
  isItemAvailable = false;
   count: number;
  searchTerm: string = '';
  items = [];
  product: any;
  medicinList={
    catName:'',
    catId:''
  }

  unFilteredMedicinList: Array<any>;
  constructor(private network: NetworkService,private route:ActivatedRoute,private modalController: ModalController,private router:Router,private alertCtrl: AlertController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.medicinList = this.router.getCurrentNavigation().extras.state.catName;
    

        console.log("data=", this.medicinList);

      }
    });
   }

  ngOnInit() {
    this.getProduct();
  
  }


  get cartCount() {
    let medicinList = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    return medicinList.length;
  }

  getProduct(){
    let cart: any = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
    console.log("category id=",this.medicinList.catId);
    this.network.getProduct(this.medicinList.catId).subscribe((res)=>{
      this.product = JSON.parse(res['_body']);
      
      let medicinList = this.product.map((item) => {
        if (!item.count) {
        if (cart.length) {
        item.count = cart.reduce((data, medicin) => {
        if (medicin && item.Id == medicin.Id) {
        data = medicin.count;
        item.cartStatus = true;
        }
        return data;
        }, 1);
        } else {
        item.count = 1;
        }
        }
        item.imageUrl = this.medicineImages.reduce((data: any, images: any) => {
        if (item.Type == images.type) data = images.url;
        return data
        }, "");
        return item;
        });
        this.unFilteredMedicinList = [...medicinList];
    })
   
  }



  getItems(ev: any) {
    // Reset items back to all of the items
    this.getProduct();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
        this.items = this.items.filter((item) => {
            return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    } 
  }


  
  selectedType(medicin: any) {
  console.log(medicin);
  }
  
  addToCart(medicin) {
  let cart: any = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
  
  this.unFilteredMedicinList = this.unFilteredMedicinList.map((item) => {
  if (item.Id == medicin.Id) item = medicin;
  return item;
  });
  if (cart.length) {
  if (cart.filter((item) => item.Id == medicin.Id).length) {
  cart = cart.map((item) => {
  if (item.Id == medicin.Id) item = medicin;
  return item;
  });
  } else cart.push(medicin);
  } else cart.push(medicin);

  localStorage.setItem("cart", JSON.stringify(cart));
  }
  
//    addToCartAction() {
//     this.addToCart(this.product);
// }

goToCart() {
  this.modalController.dismiss();
  this.router.navigate(["transaction/cart"]);
  }
 
   

    

 
  
}
