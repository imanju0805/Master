import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-slide-image',
  templateUrl: './slide-image.component.html',
  styleUrls: ['./slide-image.component.scss'],
})
export class SlideImageComponent implements OnInit {
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Input() data: any;
url="https://medv.in/medv/UserImage/ProductImage/Category/";
 sliderCon = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    autoplay:true,
     loop:true,
    speed: 400,
    autoplayDisableOnInteraction: false
   
  }
  sliderCon1 = {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    // autoplay: true,
    speed: 1000,
    autoplayDisableOnInteraction: false
  }
  slides: any;
  categoryList: any;
  catImage: string;
  category: string;
  imagecat: any;
  product: any;
  constructor(private router:Router,private network:NetworkService) { }

  ngOnInit() {
    this.getCategory();
   }

  
  get title() {
    return this.data && this.data.title
      ? this.data.title
      : "Place your order quickly with prescription";
  }

  get message() {
    return this.data && this.data.message
      ? this.data.message
      : "";
  }


  address = 'New Home Town,old way';
  salons = [
    {
      image: 'assets/imgs/1.jpg',
      price: '40',
    },
    {
      image: 'assets/imgs/makeup.jpg',
      price: '50',
    },
    {
      image: 'assets/imgs/hair_style.jpg',
      price: '60',
    },
    {
      image: 'assets/imgs/shampoo.jpg',
      price: '35',
    },
    {
      image: 'assets/imgs/curling.jpg',
      price: '32',
    },
    {
      image: 'assets/imgs/hair_color.jpg',
      price: '45',
    },
    {
      image: 'assets/imgs/face_massage.jpg',
      price: '20',
    },
    {
      image: 'assets/imgs/strait.jpg',
      price: '30',
    },
    {
      image: 'assets/imgs/spraying.jpg',
      price: '40',
    },
  ];



  onSearchChange(event) {

  }
  viewAll(){
    this.router.navigateByUrl('/transaction/view-all');
  }
 
  

  
getCategory(){
  this.network.getCategory().subscribe(result => {
    console.log(result['_body']);
 this.categoryList = JSON.parse(result['_body']);

//  this.category=this.url ;
 console.log("response is==",this.categoryList);

})

}

gotoProduct(){
  this.router.navigateByUrl("./transaction/mask");
}

categories(name){
  console.log("name",name);
  let navigationExtras: NavigationExtras = {
    state: {
     catName:name
    }
  };
  this.router.navigateByUrl('/transaction/mask',navigationExtras);
}
}
