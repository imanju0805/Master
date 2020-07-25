import { Injectable } from "@angular/core";
import { Observable, Subject, ArgumentOutOfRangeError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Headers, RequestOptions } from "@angular/http";
import { tap } from 'rxjs/operators';
import { MobileVerificationPage } from 'src/app/entry/mobile-verification/mobile-verification.page';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private nativeHttp: Http) { }

  editProfile(body): Observable<any> {
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers })
    return this.nativeHttp.post("https://medv.in/medv/api/customer/UpdateBInfo", JSON.stringify(body), options);
  }

  changePassword(body): Observable<any> {
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers })
    return this.nativeHttp.post("https://medv.in/medv/api/customer/UpdatePassword", JSON.stringify(body), options);
  }
  successPayment(invId, payment,Mob,orderid, payId): Observable<any> {
    let body = { InvId: invId, paymentResult: payment,mobNo:Mob,ordRefNo:orderid, payRef: payId }
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers })
    return this.nativeHttp.post("https://medv.in/medv/api/updatePayment", body, options);//check in first postman 
  }
  creteOrder(amt, receipt): Observable<any> {
    let body = { Amount: amt, receipt: receipt }
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers })

    return this.nativeHttp.post("https://medv.in/medv/api/createPGOrder", body, options);
  }

}
