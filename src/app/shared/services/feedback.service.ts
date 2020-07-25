import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http,Headers, RequestOptions } from "@angular/http";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  

  constructor(private nativeHttp:Http) { }


  feedback(body):Observable<any>{
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers });
    return this.nativeHttp.post('https://medv.in/medv/api/feedBack',body,options);
  }
}
