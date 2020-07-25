import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  subscribe: any;

  constructor(private menu: MenuController, private platform: Platform, private router: Router) {
    this.subscribe = this.platform.backButton.subscribe(() => {
      if (this.router.url === '/entry/welcome') {
        navigator["app"].exitApp();
      }

    })
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menu.enable(false);
  }
  login() {
    this.router.navigateByUrl('/entry/login');
  }

}
