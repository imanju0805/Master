import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.page.html',
  styleUrls: ['./view-all.page.scss'],
})
export class ViewAllPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  previousPage(){
    this.router.navigateByUrl('/transaction/tabs/home');
  }
}
