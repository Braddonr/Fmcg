import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-credit-sales',
  templateUrl: './credit-sales.component.html',
  styleUrls: ['./credit-sales.component.scss']
})
export class CreditSalesComponent implements OnInit {
  displayedColumns: string[] = ['Customer','Purchase Date','Due Date','Credit Period','Order Id','Purchase Mode','Store Name','Supplier','Status','Total Cost','Actions'];

  public dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
