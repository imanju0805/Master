import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-slide-product',
  templateUrl: './slide-product.component.html',
  styleUrls: ['./slide-product.component.scss'],
})
export class SlideProductComponent implements OnInit {
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  jsonData: any;
  sliderConfig = {
    slidesPerView: 1.2,
    centeredSlides: true,
    autoplay:false,
    speed: 1000
  };
  slideItem = [
    { id: 0, name: "Dabur Chyawanprash", image1: "assets/images/dabur.jpg" },
    { id: 1, name: "Groceries", image1: "assets/images/groceries.jpg" },
    { id: 2, name: "Eyewear", image1: "assets/images/Eye.jpg" },
    { id: 3, name: "Ayush", image1: "assets/images/Ayush.jpg" },
    { id: 4, name: "Fitness", image1: "assets/images/fitness.jpg" },
    { id: 5, name: "Personal Care", image1: "assets/images/personal.jpg" },
    { id: 6, name: "Mom & Baby", image1: "assets/images/baby.jpg" },
    { id: 7, name: "Devices", image1: "assets/images/devices.jpg" },
    { id: 8, name: "Surgical", image1: "assets/images/surgical.jpg" },
    { id: 8, name: "Treatments", image1: "assets/images/treatment.jpg" },
    { id: 8, name: "Sexual Wellness", image1: "assets/images/sexual.jpg" }
    ];
    
    slideOptions = {
    initialSlide: 1,
    slidesPerView: 3,
    spaceBetween: 20
    };
  items=[];
  private data = [
    {
      category: 'Categories',
      expanded: true,
      products: [
        { id: 0, name: 'Capsuals',image1:'/assets/images/tabs.jpeg'   },
        { id: 1, name: 'Syrups',image1:'/assets/images/Syrup.jpeg'  },
        { id: 2, name: 'Injections',image1:'/assets/images/injections.jpg' }
      ]
    }
  ];

  constructor() { }

  ngOnInit() {
    this.items = this.getProducts();
  }
  getProducts() {
    return this.data;
  }
  get title() {
    return this.data && this.title
      ? this.title
      : "Place your order quickly with prescription";
  }

  get message() {
    return this.data && this.message
      ? this.message
      : "";
  }

}
