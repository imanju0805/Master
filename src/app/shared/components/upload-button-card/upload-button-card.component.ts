import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-upload-button-card",
  templateUrl: "./upload-button-card.component.html",
  styleUrls: ["./upload-button-card.component.scss"],
})
export class UploadButtonCardComponent implements OnInit {
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Input() data: any;
  constructor() {}

  ngOnInit() {}

  uploadPrescription() {
    this.action.emit();
  }

  get title() {
    return this.data && this.data.title
      ? this.data.title
      : "Place order with Prescription";
  }

  get message() {
    return this.data && this.data.message
      ? this.data.message
      : "";
  }

  get discount() {
    return this.data && this.data.discount ? this.data.discount : 0;
  }
}
