import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Http,Headers, RequestOptions } from "@angular/http";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private nativeHttp: Http) {}
  private _refreshNeeded$=new Subject<void>();
  getCustOrders(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/order/getCustOrd?custId=" + id
    );
  }

  getLastorder(id): Observable<any>{
    return this.nativeHttp.get(
      "https://medv.in/medv/api/order/getLastOrder?custId=" + id
    );
  }
  getOrders(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv//api/getInvListbyOrder?OrdId=" +
        id +
        "&status=30"
    );
  }
  addAddress(body): Observable<any> {
    let type = "application/json; charset=UTF-8";
    let headers = new Headers({ 'Content-Type': type });
    let options = new RequestOptions({ headers: headers });
    return this.nativeHttp.post('https://medv.in/medv/api/customer/CreateOrUpdateCustAdd', body, options).pipe(
      tap(()=>{
        this._refreshNeeded$.next();
      })
    );
  }
  getQuoteSubmit(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/order/ordById?Id=" + id
    );
  }
  getInvoiceById(id): Observable<any> {
    console.log("id=", id);
    return this.nativeHttp.get(
      "https://medv.in/medv/api/getInvById?id=" + id
    );
  }
  getInvListbyOrder(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv//api/getInvListbyOrder?OrdId=" +
        id +
        "&status=30"
    );
  }

  
    cancelOrder(id,mId):Observable<any>{
      let body={orderId:id,customerId:mId}
      console.log("inside service method invoId",id," and merchId");
      let type = "application/json; charset=UTF-8";
      let headers = new Headers({ 'Content-Type': type });
      let options = new RequestOptions({ headers: headers });
      return this.nativeHttp.post('https://medv.in/medv/api/order/cancelOrder',body,options);
    }

    changePass(body):Observable<any>{
      let type = "application/json; charset=UTF-8";
      let headers = new Headers({ 'Content-Type': type });
      let options = new RequestOptions({ headers: headers });
      return this.nativeHttp.post('https://medv.in/medv/api/customer/UpdatePassword',body,options);
    }

  getPaidOrdListByCust(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/getPaidOrdListByCust?custId=" + id
    );
  }
  getPrescriptionList(id): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/getprescriptionList?OrderId=" + id
    );
  }
  getPrescriptionImage(id, orderid): Observable<any> {
    return this.nativeHttp.get(
      "https://medv.in/medv/api/Image/getprescriptionImage?OrderId=" +
        id +
        "&imageName=" +
        orderid
    );
  }
  getProfileImage(id): Observable<any>{
    return this.nativeHttp.get('https://medv.in/medv/api/Image/getCustProfPic?imageName='+id+'.jpg');
  }
  getAddress(custId){
    return this.nativeHttp.get('https://medv.in/medv/api/customer/CustAddlist?custId=' +custId)
  }
  deleteAddress(AddId): Observable<any>{
      let type = "application/json; charset=UTF-8";
      let headers = new Headers({ 'Content-Type': type });
      let options = new RequestOptions({ headers: headers })
    return this.nativeHttp.post('https://medv.in/medv/api/customer/DelCustAdd?AddId=' +AddId,options)
  }
  get refreshNeeded$(){
    return this._refreshNeeded$;
  }
  updateItemReceived(invId,custId):Observable<any>{
    let body={invId:invId,custId:custId}
    let type = "application/json; charset=UTF-8";
      let headers = new Headers({ 'Content-Type': type });
      let options = new RequestOptions({ headers: headers })
    return this.nativeHttp.post("https://medv.in/medv/api/updItmRcvdStat",body,options);
  }
  itemReceived(id):Observable<any>{
    return this.nativeHttp.get('https://medv.in/medv/api/ItemRcvd?custId='+id);
  }
  getConfig(): Observable<any>{
    return this.nativeHttp.get('https://medv.in/medv/api/app/Config?stateId=1');
  }
}
