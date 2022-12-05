import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  label: any;
  labelClass: any;
  @Input() labelValue: any;
  @Input() labelTheme: any;

  constructor() { }

  ngOnInit(): void {
    if(this.labelValue === 1 || this.labelValue === '1' || this.labelValue === true || this.labelValue === 'true' || this.labelValue === 'TRUE' || this.labelValue === 'Active')
    {
       if(this.labelTheme == "locked"){
          this.label = "Locked";
          this.labelClass = 'error';
         }
      else if(this.labelTheme == "approved"){
          this.label = "Approved";
          this.labelClass = 'green';
         }
      else if(this.labelTheme == "firstLogin"){
          this.label = "Yes";
          this.labelClass = 'processing';
         }
      else if(this.labelTheme == "deleted"){
          this.label = "Deleted";
          this.labelClass = 'warning';
         }
      else if (this.labelTheme == "reworked"){
          this.label = "Reworked";
          this.labelClass = 'purple';
         }
      else if (this.labelTheme == "enabled"){
      this.label = "Enabled";
      this.labelClass = 'cyan';
      }
      else if (this.labelTheme == "status"){
        this.label = "Active";
        this.labelClass = 'success';
          }  
      else if (this.labelTheme == "responseStatus"){
        this.label = "Success";
        this.labelClass = 'success';
          }
    } 
  
    else if (this.labelValue === '0' || this.labelValue !== '1' || this.labelValue === false || this.labelValue === 'false' || this.labelValue === 'FALSE' || this.labelValue === 'Require Repair'|| this.labelValue == 'PENDING SALES APPROVAL'|| this.labelValue=="PENDING DEPOT APPROVAL") {
      if(this.labelTheme == "locked"){
        this.label = "Not Locked";
        this.labelClass = 'success';
       }
    else if(this.labelTheme == "approved"){
        this.label = "Not Approved";
        this.labelClass = 'red';
       }
    else if(this.labelTheme == "firstLogin"){
        this.label = "No";
        this.labelClass = 'warning';
       }
    else if(this.labelTheme == "deleted"){
        this.label = "Not Deleted";
        this.labelClass = 'geekblue';
       }
    else if(this.labelTheme == "reworked"){
        this.label = "Not Reworked";
        this.labelClass = 'processing';
       }
    else if (this.labelTheme == "enabled"){
    this.label = "Disabled";
    this.labelClass = 'red';
      }
    else if (this.labelTheme == "status"){
      this.label = "Inactive";
      this.labelClass = 'red';
        }
    else if (this.labelTheme == "responseStatus"){
          this.label = "Failed";
          this.labelClass = 'red';
            }
    }
    else {
      this.label = "Inactive";
      this.labelClass = 'magenta';
    }
  }

}
