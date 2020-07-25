import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AddressSelectionService {
  constructor(private http: HttpClient) {}

  getCustomerAddressList(customerID: Number) {
    return this.http.get(
      "https://medv.in/medv/api/customer/CustAddlist?custId=" +
        customerID.toString(),
      {}
    );
  }
  
}
