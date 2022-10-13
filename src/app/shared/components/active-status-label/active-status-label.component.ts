import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-active-status-label',
  templateUrl: './active-status-label.component.html',
  styleUrls: ['./active-status-label.component.scss']
})
export class ActiveStatusLabelComponent implements OnInit {

  label: any;
  labelClass: any;
  @Input() labelValue: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue == true || this.labelValue == "true"){
      this.label = "Active";
      this.labelClass = 'green';
    } 
    else {
      this.label = "Inactive";
      this.labelClass = 'magenta';
    }
  }

}
