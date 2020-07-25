import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin } from "rxjs";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class UploadPrescriptionService {
  constructor(
    private http: HttpClient,
    private file: File,
    private transfer: FileTransfer
  ) { }

  createOrder(custId, medicinList, Address_Id, Comment): Observable<any> {
    let payload = {
      Order_Id: 0,
      Customer_Id: custId,
      OrderComment: Comment,

      Address_Id: Address_Id,
      liOrdDtls: medicinList.map(item => {
        return { MedicineId: item.Id, Order_Qty: item.count };
      })
    };
    console.log("order id=", payload.Order_Id);
    console.log("cust id=", payload.Customer_Id);
    console.log("order comment=", payload.OrderComment);
    console.log("address id==", payload.Address_Id);
    console.log("order details=", payload.liOrdDtls);
    return this.http.post("https://medv.in/medv/api/order/createOrder", payload
    );
  }

  uploadPrecription(fileURL: string, Order_Id: any) {
    console.log("image before length=", fileURL);
    let url = fileURL.split('?')[0];
    console.log("image length after crop=", url);
    return Observable.create(Observer => {
      var copyFileURL = url;
      var splitPath = copyFileURL.split('/');
      var imageName = splitPath[splitPath.length - 1];

      var filePath = fileURL.split(imageName)[0];
      this.file.readAsDataURL(filePath, imageName).then(base64 => {
        let base64Image = 'data:image/jpeg;base64,' + base64;
        var stringLength = base64Image.length - 'data:image/png;base64,'.length;
        var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
        var sizeInKb = sizeInBytes / 1000;
        let base64ImageData = base64;
        const fileTransfer: FileTransferObject = this.transfer.create();
        let params = {
          orderId: Order_Id
        }
        const uploadOpts: FileUploadOptions = {
          fileKey: 'file',
          fileName: imageName,
          params: params
        };
        if (sizeInKb >= 4096) {
          Observer.next({
            status: '500',
            statusMessage: "Reduce the size of the image",
          })
          Observer.complete();
        }
        else {
          fileTransfer.upload(base64ImageData, 'https://medv.in/medv/api/Image/uploadPrescription', uploadOpts)
            .then((data) => {
              let respData = JSON.parse(data.response);
              Observer.next({
                status: '200',
                response: respData
              })
              Observer.complete();

            }, (err) => {
              Observer.next({
                status: '600',
                response: err
              })
              Observer.complete();
              console.log(err);
              console.log("error in loading image using gallery");
            });
        }


      });
    })

  }


  createOrderHead(customerID: Number, ImageArray, Address_Id) {
    return this.http.post(
      "https://medv.in/medv/api/order/CreateOrdHead?customerId=" + customerID.toString(), {}
    ).pipe(mergeMap((res) => this.uploadPrescriptions(ImageArray, res)));//heck backup wjhat was there
  }

  uploadPrescriptions(ImageArray, orderId) {
    let data = ImageArray.map(item => {
      return this.uploadPrecription(item.newPath, orderId);
    });
    return forkJoin(data)
  }

  updateAddress(orderId, Address_Id) {
    return this.http.post(
      `https://medv.in/medv/api/customer/updateOrdAddres?addId=${Address_Id}&orderId=${orderId}`, {}
    )
  }
}
