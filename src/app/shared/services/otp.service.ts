import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(
    public httpClient: Http, private router: Router) {

  }

  createOtp(custid, otp) {
    let body = { custId: custid, OTP: otp }
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers });
    return this.httpClient.post('https://medv.in/medv/api/customer/validateNewCustOTP', JSON.stringify(body), options);
  }
  postData(id) {
    let body = { mobNo: id }
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers });
    return this.httpClient.post('https://medv.in/medv/api/customer/SingUp_CreateOTP', JSON.stringify(body), options);
  }
  validateOtp(id) {
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers });
    return this.httpClient.post('https://medv.in/medv/api/customer/ValidateOTP', JSON.stringify(id), options);
  }
  getOtp(mob):Observable<any>{
    return this.httpClient.get('https://medv.in/medv/api/SignIn_ValidateMob?mobNo='+mob);
  }
}