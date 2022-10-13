import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-success-label',
  templateUrl: './success-label.component.html',
  styleUrls: ['./success-label.component.scss']
})
export class SuccessLabelComponent implements OnInit {

  label: any;
  labelClass: any;
  @Input() labelValue: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue == "00" || this.labelValue == "successful"  || this.labelValue == "Successful" || this.labelValue == 200){
      this.label = "Successful";
      this.labelClass = 'green';
    } else if (this.labelValue == "01" || this.labelValue == "failed" || this.labelValue == "Failed") {
      this.label = "Failed";
      this.labelClass = 'magenta';
    } else {
      this.label = "Pending";
      this.labelClass = "orange";
    }
  }

}
