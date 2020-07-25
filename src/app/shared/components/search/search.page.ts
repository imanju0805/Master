import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { SearchService } from "./search.service";

import { count } from "rxjs/operators";
import { ModalController, IonInfiniteScroll, IonContent, Platform, MenuController, IonSearchbar } from "@ionic/angular";
import { Router } from "@angular/router";
import { MedicinImages } from "../../services/medicin-images";

@Component({
selector: "app-search",
templateUrl: "./search.page.html",
styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit {
@ViewChild(IonSearchbar, { static: true }) myInput: IonSearchbar;
medicinList: Array<any>;
unFilteredMedicinList: Array<any>;
showMedicin: Array<any>;
searchQuery: string;
listFetchStatus:boolean = false;
accordianMedicinId: number = 0;
selectedMedicinArray: Array<any> = [];
apiLoader:boolean = false;
numbers: Array<any> = [];
paginationCount: number = 0;
@ViewChild(IonInfiniteScroll, { static: true })
infiniteScroll: IonInfiniteScroll;

medicineImages = new MedicinImages().medicinImages;
url: any;
buttonSubscribe: any;
    searched: boolean = false;
    customErrorMsg:boolean = false;
constructor(
private searchService: SearchService,
private modalController: ModalController, private menu: MenuController,
private router: Router, private platform: Platform
) {


}

ngOnInit() {
this.medicinList = [];

setTimeout(() => { this.myInput.setFocus(); }, 150);
}
ionViewWillEnter() {

this.menu.enable(true);
}

searchMedicin(searchText: string) {
let cart: any = localStorage.getItem("cart")
? JSON.parse(localStorage.getItem("cart"))
: [];
this.searchService.searchMedicin(searchText).subscribe((res) => {
console.log(res);

let medicinList = res.map((item) => {
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
this.medicinList = [...medicinList];
this.unFilteredMedicinList = [...medicinList];
this.paginationCount = 0;
this.showMedicin = medicinList.splice(0, 10);
this.apiLoader = false;
this.customErrorMsg = false;
}, err => {
    //console.log("Okay error while fetching data");
    this.apiLoader = false;
    this.customErrorMsg = true;
  }
);

}

onSearchChange($event) {
let searchValue = $event.detail.value;
this.toggleInfiniteScroll();
 if(this.searchQuery != ''){
    this.apiLoader = true;
    this.searchMedicin(searchValue);
    this.medicinList = [];
this.unFilteredMedicinList = [];
this.showMedicin = [];
this.searched = true;

}
if(searchValue.length>=1){
  
this.searchMedicin(searchValue);

}

if (searchValue.length ==0) {
    this.listFetchStatus = true;
this.medicinList = [];
this.unFilteredMedicinList = [];
this.showMedicin = [];
}
}

addMedicin(medicin) {
this.accordianMedicinId = medicin.Id;
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

closeModal(status) {
this.modalController.dismiss({ status: status });
}

loadData(event) {
console.log(event);
this.paginationCount++;
let start = this.paginationCount * 10;
let end = start + 10;
let newShowMedicin = this.medicinList.slice(start, end);
this.showMedicin = [...this.showMedicin, ...newShowMedicin];
console.log(this.medicinList.length);
console.log(this.showMedicin);

if (this.medicinList.length <= end) {
event.target.disabled = true;
event.target.complete();
} else {
event.target.complete();
}
}

toggleInfiniteScroll() {
this.infiniteScroll.disabled = false;
}

uploadPrescription() {
this.modalController.dismiss();
this.router.navigate(["transaction/upload-prescription", 0]);
}

goToCart() {
this.modalController.dismiss();
this.router.navigate(["transaction/cart"]);
}
checkEmpty(event) {
console.log("value=", event.value);
}

get cartCount() {
let medicinList = localStorage.getItem("cart")
? JSON.parse(localStorage.getItem("cart"))
: [];
return medicinList.length;
}

get uploadCardData() {
return {
message: "",
discount: 10,
};
}

}