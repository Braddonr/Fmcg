import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-notification-label',
  templateUrl: './edit-notification-label.component.html',
  styleUrls: ['./edit-notification-label.component.scss']
})
export class EditNotificationLabelComponent implements OnInit {

  @Input() labelValue: any;
  label: any;
  labelClass: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue == true || this.labelValue == "true"){
      this.label = "Edited Awaiting Approval";
      this.labelClass = 'magenta';
    } 
    else {
      this.label = "False";
      this.labelClass = 'green';
    }
  }

}
