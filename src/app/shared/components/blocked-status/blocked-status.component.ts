import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blocked-status',
  templateUrl: './blocked-status.component.html',
  styleUrls: ['./blocked-status.component.scss']
})
export class BlockedStatusComponent implements OnInit {

  label: any;
  labelClass: any;
  @Input() labelValue: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue == true || this.labelValue == "true"){
      this.label = "True";
      this.labelClass = 'magenta';
    } 
    else {
      this.label = "False";
      this.labelClass = 'green';
    }
  }

}
