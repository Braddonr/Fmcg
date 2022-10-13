import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blocked-label',
  templateUrl: './blocked-label.component.html',
  styleUrls: ['./blocked-label.component.scss']
})
export class BlockedLabelComponent implements OnInit {

  label: any;
  labelClass: any;
  @Input() labelValue: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue == true || this.labelValue == "true"){
      this.label = "Inactive";
      this.labelClass = 'magenta';
    } 
    else {
      this.label = "Active";
      this.labelClass = 'green';
    }
  }

}
