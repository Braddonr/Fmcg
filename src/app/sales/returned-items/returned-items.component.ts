import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-returned-items',
  templateUrl: './returned-items.component.html',
  styleUrls: ['./returned-items.component.scss']
})
export class ReturnedItemsComponent implements OnInit {
  displayedColumns: string[] = ['Issue ID','Purchase ID','Customer','Store','Description','Status','Supplier','Customer Location','Store Contact','Complaint Type','Actions'];

  public dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
