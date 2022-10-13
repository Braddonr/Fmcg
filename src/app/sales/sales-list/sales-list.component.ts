import { Component, OnInit } from '@angular/core';

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  displayedColumns: string[] = ['Customer','Region','Purchase Date','Due Date','Credit Period','Order Id','Purchase Mode','Store Name','Status','Total Cost','Payment Method','Actions'];

  public dataSource: MatTableDataSource<any>;

  constructor() {}

  ngOnInit() { }

}
