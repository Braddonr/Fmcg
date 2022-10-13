import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-columns',
  templateUrl: './columns.component.html',
  styleUrls: ['./columns.component.scss']
})
export class ColumnsComponent implements OnChanges, OnInit {

  @Input() mandatoryColumns: string[];

  constructor() { }

  ngOnInit(): void {
    //console.log("mandatory columns? ", this.mandatoryColumns)
  }
  
  ngOnChanges(): void {
    //console.log("mandatory columns22? ", this.mandatoryColumns) 
  }

}
