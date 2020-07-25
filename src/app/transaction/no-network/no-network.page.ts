import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NetworkService, ConnectionStatus } from 'src/app/shared/services/network.service';


@Component({
  selector: 'app-no-network',
  templateUrl: './no-network.page.html',
  styleUrls: ['./no-network.page.scss'],
})
export class NoNetworkPage implements OnInit {
  check: Promise<boolean>;
  error: void;

  constructor(private router: Router, private networkService: NetworkService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  clickPage() {
    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        console.log("status =", status);
        console.log("authenticated value=", this.authenticationService.isAuthenticated);
        this.authenticationService.authenticationState.subscribe(state => {
          if (state) {
            this.router.navigate(['transaction/tabs/home']);
          } else {
            this.router.navigate(['entry/welcome']);
          }
        });

      }
      else {
        console.log("statues =", status);
        this.router.navigateByUrl('/transaction/no-network');
      }
    });

  }

}
