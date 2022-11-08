import { AddVanStockComponent } from './../add-van-stock/add-van-stock.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { endOfMonth } from 'date-fns';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-van-stock-list',
  templateUrl: './van-stock-list.component.html',
  styleUrls: ['./van-stock-list.component.scss']
})
export class VanStockListComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','DEPORT','CREATED ON','STOCK NUMBER','VALUE(UGX)','ROUTE','CR_NAME','VEHICLE PLATE NUMBER','APPROVED','Actions'];

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  mandatoryColumns: any[] = [ 
  "plateNumber",
  "cdCode",
  "createdBy",
  "createdOn",
  "salespersonId",
  "vehicleType",
  "userFirstName",
  "userLastName"
];
checkList : any [] = [
  { name: 'id', status: false },
  { name: 'deport', status: true },
  { name: 'stockNumber', status: true },
  { name: 'value', status: true },
  { name: 'route', status: false },
  { name: 'cdName', status: false },
  { name: 'salesPersonId', status: false },
  { name: 'vehiclePlateNumber', status: false },
  { name: 'approved', status: true },
  { name: 'actions', status: true },
 ]
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateVanStock: boolean;
  vanStockDetails: any;
  page: number = 0;
  perPage: number = 10;
  total: any;
  searchValue: string = '';
  visible: boolean = false;
  listOfData: any[] = [];
  listOfDisplayData: any;
  searchInput: string = '';
  searchfullName:string = '';
  searchEmail: string = ''
  data_loaded: boolean = false;
  loading: boolean = false;
  authorized = false;
  exportTitle: string;
  searchStatus: boolean;
  allStatus: boolean;
  showHideDetails: boolean = true;

  
  showAll = false;

  searchTerm = '';
  totalVehicles: any;
  listOfDataToDisplay: any = [];
  listOfUsers: any[] =[];
  users = [];
  listOfUsersId: any[] =[];
  listOfUsersNames: any[] =[];
  totalVanStock: number;
  
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

  vanStock: any;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private toastr : ToastrService,
    private modal: NzModalService,
    private global : GlobalService
  ) {}

  ngOnInit() {
    this.formAdd = this.formBuilder.group({
      remarks:new FormControl('', [<any>Validators.required]),
      vehicleType:new FormControl('', [<any>Validators.required]),
      plateNumber:new FormControl('', [<any>Validators.required]),
      salespersonId:new FormControl('', [<any>Validators.required]),
    });
    
    this.loadVehicles();
    this.loadUsers();
    
  }

  //opens creation modal
  triggerModal(data: any): void {
    this.updateVanStock = false;
    this.vanStockDetails = data;
    const dialogRef = this.dialog.open(AddVanStockComponent, {data: {data: this.vanStockDetails, updateVanStock: this.updateVanStock}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadVehicles();
    })
  }

  // openDialog(mode, data) {
  //   let dialogRef = this.dialog.open(AddUserDialogComponent, {
  //     width: "800px",
  //     data: {
  //       data: data,
  //       mode: mode
  //     },
  //   });

  //   return dialogRef.afterClosed().toPromise().then(res => {
  //     this.loadVehicles()
  //   });
  // }


  view(element): void {
    this.router.navigate(['/all-distributors/view-vehicle', element.id]);
  }
  
//   editUser(data: any) {
//     this.editData = true;
//     let dialogRef = this.dialog.open(AddUserDialogComponent, {
//       width: "800px",
//       data: {
//         data: data,
//         edit: this.editData
//       }
//     });
//     return dialogRef.afterClosed().toPromise().then(res => {
//       this.loadVehicles();
//     });
// }

loadVehicles(){
  this.loading = true;
 this.httpService.get("distributor/vehicle/all", this.page, this.perPage).subscribe(res => {
   if(res['responseCode'] == 200 || res['responseCode'] == 201){
     this.loading = false;
   this.listOfData = res['data'];
   this.totalVanStock = res['totalCount'];

   console.log('van-stock-list');
   console.log(this.listOfData);

   // @ts-ignore
   this.dataSource= new MatTableDataSource();
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort
   this.totalVanStock = res['totalCount'];

   
   this.listOfDataToDisplay = [...this.listOfData];

   this.listOfData.map((value, i) => {
    value.ID = (this.page) * this.perPage + i+1;
  });

   this.listOfDisplayData = [...this.listOfData];
   let columns = [];
   this.listOfData.map(item => {
     Object.keys(item).map(itemKeys => {
       columns.push(itemKeys);
     })
   });
   this.columnsToExport = Array.from(new Set(columns));
   this.columnsToExport.map(item =>{
     switch(item){
      
       case 'UserName':
         this.columnsJson['UserName'] = 'UserName';
         break;
       case 'FullName': 
         this.columnsJson['Full Name'] = 'FullName';
         break;
       case 'Email':
         this.columnsJson['Email'] = 'Email';
         break;
      case 'Active':
        this.columnsJson['Status'] = 'Active';
      
       default: 
       break;
     }
   });
   this.displayColumns = Object.keys(this.columnsJson);
   this.loading=false;
 }
 })
}

loadUsers(){
  this.httpService.get("user/all", this.page, this.perPage).subscribe(res => {
   
    let data: any;
    data = res['data'];
    console.log('ooo',data);
    
    data.map((x: any) => {
      this.listOfUsers.push({id: x.id, userName: x.userName})
      console.log(this.listOfUsers);
    })
    this.listOfUsers.map((item)=>{
      this.users.push(item)
       console.log(',,,,', this.users)
    } 
    );
  });
}
//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
 const {pageSize, pageIndex} = params;
 this.page = pageIndex;
 this.perPage = pageSize;
 this.loadVehicles();
}

selectedColumns(event):void{
 this.mandatoryColumns = event;
}
reset(): void{
 this.searchValue = '';
 this.search();
}

search(): void{
 this.visible = false;
 this.listOfDisplayData = this.listOfData.filter((item)=> 
 item.FullName.toLowerCase().indexOf(this.searchValue) !== -1
 );
}

statusSearch(){
  // this.visible = false;
  console.log(this.searchStatus)
  if(this.searchStatus == false){
    this.allStatus = false;
  }
  this.listOfDisplayData = this.listOfData.filter(item=>
    item.Active == this.searchStatus);
}
removeStatusFilter(){
  // this.visible = false;
  this.listOfDisplayData = this.listOfData

}

userNameSearch(){
  if(this.searchValue.length < 1){
    return this.loadVehicles();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    return this.loadVehicles();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    return this.loadVehicles();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
return this.loadVehicles();
 } else{
   this.listOfDisplayData = this.listOfData.filter((item) => {
     return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.FullName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.Email.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
     item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
 })
 }
}

// Search/Filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLocaleLowerCase()

 if(this.dataSource.paginator){
   this.dataSource.paginator.firstPage()
 }
}


// form:FormGroup = new FormGroup({
//   Position: new FormControl(false),
//   DEPORT: new FormControl(false),
//   STOCK_NUMBER: new FormControl(false),
//   VALUE(UGX): new FormControl(false),
//   ROUTE: new FormControl(false),
//   CR_NAME: new FormControl(false),
//   VEHICLE_PLATE_NUMBER: new FormControl(false),
//   APPROVED: new FormControl(false),
//   CREATED_ON: new FormControl(false),
// });

// Position = this.form.get('ID');
// DEPORT = this.form.get('cdCode');
// STOCK_NUMBER = this.form.get('cdCode');
// VALUE(UGX) = this.form.get('vehicleType');
// ROUTE = this.form.get('plateNumber');
// CR_NAME = this.form.get('userFirstName'+ 'userLastName');
// VEHICLE_PLATE_NUMBER = this.form.get('regisalespersonIdonCode');
// APPROVED = this.form.get('createdBy');
// CREATED_ON = this.form.get('createdOn');

// cbValues;

// columns: string[];
/**
 * Control column ordering and which columns are displayed.
 */

 columnDefinitions = [
  { def: 'Position', label: 'Position', },
  { def: 'ID', label: 'ID', },
  { def: 'DEPORT', label: 'DEPORT', },
  { def: 'STOCK_NUMBER', label: 'STOCK NUMBER', },
  { def: 'VALUE(UGX)', label: 'VALUE(UGX)', },
  { def: 'ROUTE', label: 'ROUTE', },
  { def: 'CR_NAME', label: 'CR NAME', },
  { def: 'VEHICLE_PLATE_NUMBER', label: 'VEHICLE PLATE NUMBER', },
  { def: 'APPROVED', label: 'APPROVED By',},
  { def: 'CREATED_ON', label: 'CREATED_ON',},
]

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

//filter search from backend (pass in search parameters to backend)
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

   //date picker
   onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
  
  //open nzAddModal 
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.loadVehicles();
  }

  handleOkAdd(): void {
    this.addNewVehicle();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadVehicles();
    this.vanStock = element;
    this.formEdit = this.formBuilder.group(this.vanStock);
    this.isVisibleEdit = true;
    console.log(this.vanStock)
  }

  handleOkEdit(): void {
    this.editVehicle();
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancelEdit(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }

  //open delete confirmation modal

  showDeleteConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Delete outlet',
      nzContent: '<p style="color: red;">Are you sure you want to delete this outlet?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  addNewVehicle(){
    this.httpService.post("distributor/vehicle/add", this.formAdd.value)
    .subscribe({
     next:(res)=> {
       this.toastr.success("Outlet details added", "Success!");
       this.formAdd.reset();
     },
     error:()=>{
       this.toastr.error("Outlet details were not added", "Error!");
     },
    })
  }
  editVehicle(){
    const model={
      id: this.vanStock["id"],
      cdCode: this.formAdd.value.cdCode,
      vehicleType: this.formAdd.value.vehicleType,
      plateNumber: this.formAdd.value.plateNumber,
      salespersonId: this.formAdd.value.salespersonId,
      previousdata: {
        id: this.vanStock["id"],
        cdCode : this.vanStock["cdCode"],
        vehicleType: this.vanStock["vehicleType"],
        plateNumber: this.vanStock["plateNumber"],
        salespersonId: this.vanStock["salespersonId"]
      }
    };
    this.httpService.put("distributor/edit-vehicle", model).subscribe(res => {
      if (res['status'] === "Success") {
        if(res["message"] = "Outlet added successfully!") {
          this.toastr.success("Outlet details updated, awaiting approval", "Success!");
          this.loadVehicles();
        } else {
          this.toastr.success("Outlet details updated,", "Success!");
          this.loadVehicles();
        }
        
      } else {
        this.toastr.error("Outlet details were not updated", "Error!");
      }
      this.loadVehicles();
    })
  }

  delete(element){

  }
  // Download PDF
  exportVanStockPDF() {
    let element = 'table'
       let PDFTitle = 'Van Stock List';
       this.global.exportPDF(element, 'Van Stock', PDFTitle);

  }
//export excel file
exportVanStockExcel(){
  let element = document.getElementById('vanStockListTable');
  this.global.exportTableElmToExcel(element, 'Van StockList');
}

//export csv file
exportVanStockCSV(){
  this.global.exportToCsv(this.listOfDataToDisplay,
  'Vehicles', [
  'ID',
  'cdCode',
  'vehicleType',
  'plateNumber',
  'userName',
  'salesPerson',
  'createdBy',
  'createdOn',
  'actions',
]);
}



}

