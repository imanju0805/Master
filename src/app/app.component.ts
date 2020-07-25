import { Component, ViewChildren, QueryList } from '@angular/core';
import { Platform, MenuController, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { trigger, transition, animate, style } from '@angular/animations';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from './shared/services/authentication.service';
import { StorageService } from './shared/services/storage.service';
import { NetworkService } from './shared/services/network.service';
import { Network } from '@ionic-native/network/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Location } from '@angular/common';

@Component({
  animations: [
    trigger(
      'animate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms', style({ opacity: 0 }))
      ])
    ]
    )
  ],
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets:
    QueryList<IonRouterOutlet>;
  constructor(private menuCtrl: MenuController, private networkService: NetworkService, private network: Network,
    private platform: Platform, private authenticationService: AuthenticationService, private authService: AuthenticationService, private storage: StorageService,
    private router: Router, private navCtrl: NavController, private fcm: FCM,
    private splashScreen: SplashScreen, private location: Location,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })

  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
    this.backButtonEvent();
    this.platform.ready().then(() => {

      if (this.platform.is('android')) {
        this.fcm.getToken().then(token => {

          console.log("fcm token inside component=", token);

        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log(token);
        });

        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background');
            this.router.navigate([data.landing_page]);
          } else {
            console.log('Received in foreground');
          }
        });
      }
    });

    if (this.network.type === 'none') {
      console.log("if condition", this.network.type);
      this.router.navigate(['/transaction/no-network']);
    }
    else {
      console.log("else condition", this.network.type);
      this.checkPage();
    }

  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      console.log('Another handler was called!');
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {

        if (this.router.url === "/transaction/tabs/home") {
          navigator['app'].exitApp();
        }

        else if (this.router.url === "/transaction/tabs/order") {

          this.router.navigate(["/transaction/tabs/home"]);

        }
        else if (this.router.url === "/transaction/tabs/account") {

          this.router.navigate(["/transaction/tabs/home"]);

        }
        else if (this.router.url === "/transaction/tabs/subscription") {

          this.router.navigate(["/transaction/tabs/home"]);

        }
        else if (this.router.url === "/transaction/tabs/wallet") {

          this.router.navigate(["/transaction/tabs/home"]);

        }

      });
    });



  }

  checkPage() {
    this.authenticationService.authenticationState.subscribe(state => {
      console.log("inside check function", state);
      if (state) {
        this.router.navigate(['/transaction/tabs/home']);

      } else {
        this.storage.getObject("userData").then(res => {
          if (res == null) {
            this.navCtrl.navigateRoot('/entry/welcome');
          }
        })


      }
    });
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  logout() {
    this.storage.clear();
    localStorage.removeItem("cart");
    this.authService.logout();
  }
  activePath = '';

  public MenuList = [
    {
      id: 0,
      title: 'Home',
      url: '/transaction/tabs/home',
      icon: 'home',
    },
    {
      id: 1,
      title: 'Order History',
      url: '/transaction/my-orders',
      icon: 'tablet-portrait',
    },
    {
      id: 2,
      title: 'Profile',
      url: '/transaction/tabs/account',
      icon: 'person',
    },
    {
      id: 3,
      title: 'Contact Us',
      url: '/entry/feedback',
      icon: 'clipboard',
    }
  ]
  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
