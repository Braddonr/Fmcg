import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { User } from '../models/user';

import { ApprovalDialogComponent } from './approval-dialog/approval-dialog.component';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.scss']
})
export class PendingApprovalComponent implements OnInit {

  pendingUsers: any[];
  selection = new SelectionModel<any>(true, []);
  data: any;
  dataSource: any[] = [];
  model: User = new User();
  _data: any[];
  displayedColumns: string[];

  constructor(
    public dialog: MatDialog,
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getUsers(this.model);
  }

  //retrieves users who are yet to be approved
  getUsers(model): void {
    this._httpService.get('api/v1/workflow/get-user-pending-actions').subscribe(res => {
      if (res['status'] === 'success') {
        this.pendingUsers = res['data'];
        // console.log('pending approval: ', this.pendingUsers);
        this.displayedColumns = model.getCheckedColumns();
        this.pendingUsers.map(item => {
          this.dataSource.push(JSON.parse(JSON.parse(item['data'])))
        });
        //console.log('parsed data: ', this.dataSource)
      }
    })
  }

  //triggers dialog that handles user approval
  approveUser(data: any): void {
    const dialogRef = this.dialog.open(ApprovalDialogComponent, {data: {data: data}, height: '200px', width: '300px', position: {right: '20px'}, disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers(this.model);
    })

  } 

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }

}
