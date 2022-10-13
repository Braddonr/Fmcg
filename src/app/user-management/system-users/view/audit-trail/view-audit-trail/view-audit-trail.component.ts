import { Component, OnInit, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-audit-trail',
  templateUrl: './view-audit-trail.component.html',
  styleUrls: ['./view-audit-trail.component.scss']
})
export class ViewAuditTrailComponent implements OnInit {
  // @Input() formData;
  constructor(
    @Inject(MAT_DIALOG_DATA) public formData
    ) 
    { }

  ngOnInit() {
   
  }

}
