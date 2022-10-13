import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';


import { User } from '../models/user';

import { AddUserComponent } from '../add-user/add-user.component';
import { AssignProfileComponent } from '../assign-profile/assign-profile.component';
import { DataExportationService } from 'src/app/shared/services/data-exportation.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { UserDetailsComponent } from '../user-details/user-details.component';

interface data {
  id : number;
  firstName: string;
  middleName: string;
  email: string;
  mobileNumber: string;
}

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})

export class ListUsersComponent implements OnInit {

  displayedColumns: string[] = ['Position','ID','FULL_NAME','EMAIL','PHONE_NUMBER','STATUS','BLOCKED','PENDING_ACTION','CREATED_BY','CREATED_ON','Actions'];

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  cardTitle: string;
  columnsToDisplay: any = {};
  _data: any[];
  data: any;
  dataToExport: any[];
  endDate: string;
  exportTitle: string;
  loading: boolean = false;
  mandatoryColumns = ["First Name", "Last Name", "Email", "Phone Number", "Status", "Blocked", "Pending Action", "CreatedOn"];
  model: User = new User();
  listOfData: any[] = [];
  listOfDisplayData: any;
  page: number = 1;
  perPage: number = 10;
  profiles: any[] = [];
  selection = new SelectionModel<any>(true, []);
  startDate: string;
  total: number;
  updateUser: boolean;
  userColumns: any;
  userDetails: any;
  userExportColumns: string[];
  userExportRows: any[];
  showHideDetails: boolean = true;
  userId: any;
  id: number;
  
  title = 'app';

  constructor(
    public dialog: MatDialog,
    private _dataExportationService: DataExportationService,
    private _globalService: GlobalService,
    private _httpService: HttpService,
    private router: Router,
    private toaster: ToastrService,
    private snackBar: MatSnackBar
  ) {
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
   }

  ngOnInit(): void {

    const profiles = JSON.parse(localStorage.getItem('profiles'));
    console.log('profiles')
    console.log(profiles)
    this.loadData();
  }

  //opens user creation modal
  triggerModal(data: any): void {
    this.updateUser = false;
    this.userDetails = data;
    const dialogRef = this.dialog.open(AddUserComponent, {data: {data: this.userDetails, updateUser: this.updateUser}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadData();
    })
  } 
  
  //retrieves all created users
  loadData(): void {
    this.loading = true;
    this.cardTitle = "Registered Users List";
    let model = {
      page: (this.page - 1),
      size: this.perPage
    }
    this._httpService.retrieveData('user/all', model).subscribe(data => {
      if(data['responseCode'] === 200) {
        this.listOfData = data['data'];
          console.log('all users');
          console.log(this.listOfData);
        //console.log("created users: ", this._data);

        // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort

      } 
      
    })
  }

  //updates request params
  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadData();
  }

   //open user update modal
   edit(data: any): void {
    this.userDetails = data;
    console.log(data)
    this.updateUser = true;
    const dialogRef = this.dialog.open(AddUserComponent, {data: {data: this.userDetails, updateUser: this.updateUser}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    })
  }

 // Delete Confirmation Dialog
 delete() {
  const dialogRef = this.dialog.open(DialogComponent,{
    data:{
      message: 'Are you sure want to delete?',
      buttonText: {
        ok: 'Save',
        cancel: 'No'
      }
    }
  });
  const snack = this.snackBar;

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      console.log("Implement delete functionality here");
      snack.dismiss();
      const a = document.createElement('a');
      a.click();
      a.remove();
      snack.dismiss();
      this.snackBar.open('Data deleted successfully', 'Eclectics International', {
        duration: 2000,
      });
    }
  });
}



  //navigates to single user view
  view(element): void {
    console.log(element);
    this.router.navigate(['/user-profile/view-user', element.userName]);
  }

  //assigns a users a profile
  assignProfile(element): void {
    this.userDetails = element;
    this.updateUser = true;
    const dialogRef = this.dialog.open(AssignProfileComponent, {data: {data: this.userDetails, updateUser: this.updateUser}, height: '300px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //this.loadData();
    })
  }
  // Search/Filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLocaleLowerCase()

 if(this.dataSource.paginator){
   this.dataSource.paginator.firstPage()
 }
}

// Hide/Show Columns
  columnDefinitions = [
    { def: 'Position', label: 'Position', },
    { def: 'ID', label: 'ID', },
    { def: 'FULL_NAME', label: 'FULL NAME', },
    { def: 'EMAIL', label: 'EMAIL', },
    { def: 'PHONE_NUMBER', label: 'PHONE NUMBER', },
    { def: 'STATUS', label: 'STATUS', },
    { def: 'BLOCKED', label: 'BLOCKED', },
    { def: 'PENDING_ACTION', label: 'PENDING ACTION', },
    { def: 'CREATED_BY', label: 'CREATED_BY',},
    { def: 'CREATED_ON', label: 'CREATED ON',},
  ]
  
  show_hide_details() {
  
    this.showHideDetails= !this.showHideDetails;
    }



// Download PDF
    exportUsersPDF() {
      var prepare=[];
      this.listOfData.forEach(e=>{
        var tempObj =[];
        tempObj.push(e.userName);
        tempObj.push(e.firstName);
        tempObj.push(e.middleName);
        tempObj.push(e.lastName);
        tempObj.push(e.email);
        tempObj.push( e.mobileNumber);
        tempObj.push(e.createdBy);
        tempObj.push(e.createdOn);
        prepare.push(tempObj);
      });
      const doc = new jsPDF('l', 'mm', 'a4',);
      var fontSize = 12; 
      var imageUrl = "./assets/images/iko-stock-logo.png";
      doc.setFontSize(fontSize);
      doc.addImage(imageUrl, 'JPEG', 130, 5, 35, 35,);
      doc.text("REGISTERED USERS LIST",  124, 48,);
      autoTable(doc, {
          head: [['USER NAME','FIRST NAME','MIDDLE NAME','LAST NAME','EMAIL','PHONE NUMBER','CREATED BY','CREATED ON']],
          margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
          body: prepare,
          startY: 60,
          theme: 'striped',
          headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
          foot: [['','', '','','@Eclectics International',' ','','',]],
          footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 15},
          bodyStyles: {minCellHeight: 11, fontSize: 11}
      });

      doc.save('Users_List' + '.pdf');
    }

    exportXLSX(){
      
    }
}
