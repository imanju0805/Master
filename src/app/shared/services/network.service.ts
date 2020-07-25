import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx'
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { Http,Headers, RequestOptions } from "@angular/http";
import { Router } from '@angular/router';
 
export enum ConnectionStatus {
  Online,
  Offline
}
 
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
 
  constructor(private nativeHttp: Http,private network: Network,private router:Router, private toastController: ToastController, private plt: Platform) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }
 
  public initializeNetworkEvents() {
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('WE ARE OFFLINE');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }
 
  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    console.log("connection ",connection);
    if(connection=='online'){
      let toast = this.toastController.create({
        message: `You are now ${connection}`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
      this.router.navigateByUrl('/transaction/tabs/home');
    }
    else{
      let toast = this.toastController.create({
        message: `You are now ${connection}`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
      this.router.navigateByUrl('/transaction/no-network');
    }
   
    
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  getMerchant(id,lat, lang): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/customer/getNearByParner?lat=" +
        lat +
        "&lang=" +
        lang + "&custId=" + id 
    );
  }

  getCategory(){
  return this.nativeHttp.get("https://medv.in/medv/api/OTC/categ")
  }

  getProduct(catId){
    return this.nativeHttp.get("https://medv.in/medv/api/OTC/prod?category=" + catId)
    }
}