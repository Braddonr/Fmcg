import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';

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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd/modal';

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

  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';

  @Input() toolTipResetTitle: string = "Reset Password";
  @Input() toolTipResetColor: string = "red";
  @Input() toolTipResetPosition = 'bottom';

  @Input() toolTipEditTitle: string = "Block";
  @Input() toolTipEditColor: string = "red";
  @Input() toolTipEditPosition = 'bottom';


  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

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
  
  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Profile ID', status: false },
    { name: 'User Name', status: true },
    { name: 'First Name', status: true },
    { name: 'Middle Name', status: false },
    { name: 'Last Name', status: true },
    { name: 'Email', status: true },
    { name: 'Mobile Number', status: true },
    { name: 'Region Code', status: false },
    { name: 'Territory Code', status: false },
    { name: 'Trials', status: true },
    { name: 'Locked', status: true },
    { name: 'First Login', status: true },
    { name: 'Created On', status: true },
    { name: 'Created By', status: true },
    { name: 'Actions', status: true },
  ]
  
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
  showAll = false;

  searchTerm = '';
  totalCoolers: any;
  listOfDataToDisplay: any = [];
  listOfUsers : any = [];

  isVisibleEdit = false;
  isVisibleAdd = false;

  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visible5: boolean = false;
  visible6: boolean = false;
  visible7: boolean = false;
  visible8: boolean = false;
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  formAdd: FormGroup;
  formEdit: FormGroup;
  user: any;
  readableLocked: any[]=[];
  readablefirstLogin: any[]=[];

  readable1: any[]=[];
  readable2: any[]=[];
  readableTrue: any;
  readableFalse: any;

  passwordVisible = false;
  newPassword?: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private toastr : ToastrService,
    private modal: NzModalService,
    private global : GlobalService,
    private http: HttpClient
  ) {
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
   }

  ngOnInit(): void {
    
    this.formAdd = this.formBuilder.group({
      profileId:new FormControl('', [<any>Validators.required]),
      email:new FormControl('', [<any>Validators.required]),
      firstName:new FormControl('', [<any>Validators.required]),
      middleName:new FormControl('', [<any>Validators.required]),
      lastName:new FormControl('', [<any>Validators.required]),
      mobileNumber: new FormControl('', [<any>Validators.required]),
      regionCode: new FormControl('', [<any>Validators.required]),
      territoryCode: new FormControl('', [<any>Validators.required]),
      userName: new FormControl('', [<any>Validators.required])
    }); 
    this.formEdit = this.formBuilder.group({
      newPassword:new FormControl('', [<any>Validators.required]),
      // userName: new FormControl('', [<any>Validators.required])
    }); 

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
    this.httpService.get('user/all', this.page, this.perPage ).subscribe(data => {
      if(data['responseCode'] === 200) {
        this.loading = false;
        this.listOfData = data['data'];
        this.total = data['totalCount']

        // this.readablefirstLogin = data['data']['firstLogin']
          console.log('all users');
          console.log(this.listOfData);
          
          // console.log(this.readablefirstLogin);
          
        //console.log("created users: ", this._data);

    this.listOfDataToDisplay = [...this.listOfData];
      } 

  //decode response 
    this.listOfData.map((x:any) => {
      if(x.locked == true && !this.readable1.includes(x.locked) ){
        this.readable1.push(x.locked)
        this.readableTrue= this.readable1[0];
      }
      else if(x.locked == false && !this.readable2.includes(x.locked)){
        this.readable2.push(x.locked)
        this.readableFalse= this.readable2[0];
      }
    })
  
    console.log(this.readableTrue);
    console.log(this.readableFalse);

    // this.decodeResponse();    
      // this.listOfData.map((x: any) => {
      //   if(!this.readableLocked.includes(x.locked)){
      //   this.readableLocked.push(x.locked)
      //  }
      // })
      // console.log(this.readableLocked);

      // this.listOfData.map((x: any) => {
      //   if(!this.readablefirstLogin.includes(x.firstLogin)){
      //   this.readablefirstLogin.push(x.firstLogin)
      //  }
      // })
      // console.log(this.readablefirstLogin);
      
    })
  }

  loadUsers(){
    this.httpService.get("user/all", this.page, this.perPage).subscribe(res => {
     
      let data: any;
      data = res['data'];
      console.log('ooo',data);
      
      data.map((x: any) => {
        if(!this.listOfUsers.includes(x.id)){
        this.listOfUsers.push({id: x.id, userName: x.userName})
        console.log(this.listOfUsers);
        }
      })
    });
  }

  decodeResponse(){
    if(this.readableTrue[0] == true){
      console.log(true);
    }
  }

  show_hide_all() {
    this.checkList.forEach(item => {
        item.status = this.showAll
    });
  }
   showHideColumn(name: string): boolean {
    let temp = this.checkList.filter(item => item.name == name);
    return temp[0].status
  }
  
  toggleStatus(name: string) {
    this.checkList.forEach(item => {
      if (item.name == name) {
        item.status = !item.status
      }
        this.showAll = false;
  
    });
  }
  
    searchID() { }
    searchOutletName() { }
    searchType() { }
    searchOutletRoute() { }
    searchLocation() { }
    searchCdCode() { }
    searchCdName(event: Event) {
      // this.visible = false;
      const searchTerm = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
      console.log(searchTerm)
      // this.listOfDataToDisplay = this.listOfData.filter((item: Outletdata) => item.cdName.toString().toLowerCase().indexOf(this.searchTerm) !== -1);
      // console.log(this.listOfDataToDisplay);
  
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
 delete(element): void {
  const snack = this.snackBar;

  this.loading = true;
  this.httpService.deleteByUserName("user/delete", element.userName)
    .subscribe({
      next: (res) => {
        console.log(res)
        const a = document.createElement('a');
        a.click();
        a.remove();
        snack.dismiss();
        this.loading= false;
        this.snackBar.open('Data deleted successfully', 'Eclectics International', {
          duration: 2000,
        });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Error deleting data', 'Eclectics International', {
          duration: 2000,
        });
        this.loading= false;
      }
    })
}
blockUser(element): void{
console.log(element.userName);
this.httpService.post('user/block', element.userName)
.subscribe({
  next:(res)=> { 
   let message: any;
   message = res['message']
    this.toastr.success(message, "Success!");
    this.formAdd.reset();
  },
  error:(err)=>{
   let errorMessage: any;
   errorMessage = err.error['message']

    this.toastr.error(errorMessage, "Error!");
  },
 })
}

  //navigates to single user view
  view(element): void {
    console.log(element);
    this.router.navigate(['/user-management/view-user', element.userName]);
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
  
   //date picker
   onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

  //open nzAddModal 
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.loadData();
    this.loadUsers();
  }

  handleOkAdd(): void {
    this.addNewUser();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }


  //       //open nzEditModal 
  showModalEdit(element): void {
    this.user = element;
    console.log(this.user);
    // this.formEdit = this.formBuilder.group(this.user);
    this.isVisibleEdit = true;
  }

  handleOkEdit(): void {
    this.resetPassword();
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancelEdit(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }

  showBlockConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Block user',
      nzContent: '<p style="color: red;">Are you sure you want to block this user?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.blockUser(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  showDeleteConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Delete user',
      nzContent: '<p style="color: red;">Are you sure you want to delete this user?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

 addNewUser(){
  this.httpService.post("user/add", this.formAdd.value)
  .subscribe({
   next:(res)=> { 
    let message: any;
    message = res['message']
     this.toastr.success(message, "Success!");
     this.formAdd.reset();
   },
   error:(err)=>{
    let errorMessage: any;
    errorMessage = err.error['message']

     this.toastr.error(errorMessage, "Error!");
   },
  })
 }

resetPassword(){
  const passwordReset = {
    username: this.user.username,
    newPassword: this.formEdit.value.newPassword,
    }
    this.loading = true; 
    this.httpService.put("user/reset-password", passwordReset)
    .subscribe({
     next:(res)=> {
      let message: any;
      message = res['message']
      this.loading = false;
       this.toastr.success(message, "Success!");
       this.formEdit.reset();
     },
     error:(err)=>{
      let errorMessage: any;
      errorMessage = err.error['message']
  
       this.toastr.error(errorMessage, "Error!");
     },
    })
}

// Download PDF
    exportUsersPDF() {
      let element = 'table'
    let PDFTitle = 'Users';
   this.global.exportPDF(element, 'Users', PDFTitle);
    }

    exportUsersExcel(){
    let element = document.getElementById('usersTable');
    this.global.exportTableElmToExcel(element, 'Users');
    }

    exportUsersCSV(){
    this.global.exportToCsv(this.listOfDataToDisplay,
        'Cooler Maintenance Companies', [
          'id',
          'profileId',
          'userName',
          'firstName',
          'middleName',
          'lastName',
          'email',
          'mobileNumber',
          'regionCode',
          'territoryCode',
          'trials',
          'locked',
          'firstLogin',
          'createdOn',
          'CreatedBy'
        ]);
    }
}
