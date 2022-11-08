import { DialogComponent } from '../dialog/dialog.component';
import { AddVanComponent } from './../add-van/add-van.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-all-vehicles',
  templateUrl: './all-vehicles.component.html',
  styleUrls: ['./all-vehicles.component.scss']
})
export class AllVehiclesComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','CD_CODE','Vehicle_Type','Plate_Number','User_Name','Sales_Person','Created_By','Created_On','Actions'];

  //define tool tip properties
  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';

  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';

  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


 column = this.formBuilder.group({
    ID: true,
    cdCode: true,
    vehicleType: true,
    plateNumber: true,
    userName: true,
    salesPerson: true,
    createdOn: true,
    actions: true,
    createdBy: true,
 });

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
  { name: 'cdCode', status: true },
  { name: 'vehicleType', status: true },
  { name: 'plateNumber', status: true },
  { name: 'userFirstName', status: false },
  { name: 'userLastName', status: false },
  { name: 'salesPersonId', status: false },
  { name: 'createdBy', status: false },
  { name: 'createdOn', status: true },
  { name: 'actions', status: true },
 ]
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateVan: boolean;
  vanDetails:any;
  page: number = 0;
  perPage: number = 10;
  total: number;
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
  showHideID: boolean = false;
  showHideCode: boolean = false;
  showHideVehicleType: boolean = false;
  showHidePlateNumber: boolean = false;
  showHideUserName: boolean = false;
  showHideSalesPerson: boolean = false;
  showHideCreatedBy: boolean = false;
  showHideCreatedOn: boolean = false;
  showHideAction: boolean = false;
  
  ID: string;
  cdCode: string;
  vehicleType: string;
  plateNumber: string;
  userName: string;
  salePerson: string;
  createdOn: string;
  actions: string;
  createdBy: string;

  showAll = false;

  searchTerm = '';
  totalVehicles: any;
  listOfDataToDisplay: any = [];
  listOfUsers: any[] =[];
  users = [];
  listOfUsersId: any[] =[];
  listOfUsersNames: any[] =[];
  
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

  vehicle: any;

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

  //opens distributer creation modal
  triggerModal(data: any): void {
    this.updateVan = false;
    this.vanDetails = data;
    const dialogRef = this.dialog.open(AddVanComponent, {data: {data: this.vanDetails, updateVan: this.updateVan}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadVehicles();
    })
  }

  //open van update modal
  edit(data: any): void {
    this.vanDetails = data;
    this.updateVan = true;
    const dialogRef = this.dialog.open(AddVanComponent, {data: {data: this.vanDetails, updateVan: this.updateVan}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadVehicles();
    })
  }

  // Delete Confirmation Dialog
  delete(element): void {
    const snack = this.snackBar;

    this.loading = true;
    this.httpService.deleteId("distributor/delete-vehicle", element.id)
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
          this.loadVehicles();
        },
        error: () => {
          this.snackBar.open('Error deleting data', 'Eclectics International', {
            duration: 2000,
          });
          this.loading= false;
        }
      })
  }


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
   this.totalVehicles = res['totalCount'];
   console.log('all vehicles');
   console.log(this.listOfData);

   this.listOfDataToDisplay = [...this.listOfData];

   // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort
   this.total = res['totalCount'];

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
    // this.listOfUsers.map((item)=>{
    //   this.users.push(item)
    //    console.log(',,,,', this.users)
    // } 
    // );

    // for(var i=0; i<this.listOfUsers.length; i++){
    //   let obj: any;
    //   obj = this.listOfUsers[i]; 
       
    //   // this.users.push(obj)
    //   console.log('>>>>>>', obj.userName);
    // }
       
    // }
    // // let listofUsersEntries: any;
    // // listofUsersEntries= [...this.listOfUsers.entries()];

    // // for (let i of listofUsersEntries){
    // //   console.log(i)
    // }
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

form:FormGroup = new FormGroup({
  Position: new FormControl(false),
  CD_CODE: new FormControl(false),
  Vehicle_Type: new FormControl(false),
  Plate_Number: new FormControl(false),
  User_Name: new FormControl(false),
  Sales_Person: new FormControl(false),
  Created_By: new FormControl(false),
  Created_On: new FormControl(false),
});

Position = this.form.get('ID');
CD_CODE = this.form.get('cdCode');
Vehicle_Type = this.form.get('vehicleType');
Plate_Number = this.form.get('plateNumber');
User_Name = this.form.get('userFirstName'+ 'userLastName');
Sales_Person = this.form.get('regisalespersonIdonCode');
Created_By = this.form.get('createdBy');
Created_On = this.form.get('createdOn');

cbValues;

columns: string[];
/**
 * Control column ordering and which columns are displayed.
 */

columnDefinitions = [
  { def: 'Position', label: 'Position', },
  { def: 'ID', label: 'ID', },
  { def: 'CD_Code', label: 'CD Code', },
  { def: 'Vehicle_Type', label: 'Vehicle Type', },
  { def: 'Plate_Number', label: 'Plate Number', },
  { def: 'User_Name', label: 'User Name', },
  { def: 'Sales_Person', label: 'Sales Person', },
  { def: 'Created_By', label: 'Created By',},
  { def: 'Created_On', label: 'Created On',},
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
    this.vehicle = element;
    this.formEdit = this.formBuilder.group(this.vehicle);
    this.isVisibleEdit = true;
    console.log(this.vehicle)
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
       let message: any;
       message = res['message']
        this.toastr.success(message, "Success!");
        this.form.reset();
      },
      error:(err)=>{
       let errorMessage: any;
       errorMessage = err.error['message']
 
        this.toastr.error(errorMessage, "Error!");
      },
     })
  }
//edit vehicle
  editVehicle(){
    const model={
      id: this.vehicle["id"],
      cdCode: this.form.value.cdCode,
      vehicleType: this.form.value.vehicleType,
      plateNumber: this.form.value.plateNumber,
      salespersonId: this.form.value.salespersonId,
      previousdata: {
        id: this.vehicle["id"],
        cdCode : this.vehicle["cdCode"],
        vehicleType: this.vehicle["vehicleType"],
        plateNumber: this.vehicle["plateNumber"],
        salespersonId: this.vehicle["salespersonId"]
      }
    };
    this.httpService.put("distributor/edit-vehicle", model)
    .subscribe({
      next:(res)=> { 
        let message: any;
        message = res['message']
         this.toastr.success(message, "Success!");
         this.form.reset();
         this.loadVehicles();
       },
       error:(err)=>{
        let errorMessage: any;
        errorMessage = err.error['message']
        if(errorMessage === "null"){
          let error: any;
          error = "An error occurred. Try again later"
          this.toastr.error(error, "Error!");
        }
        else{
         this.toastr.error(errorMessage, "Error!");
        }
       },
      }) 
      this.loadVehicles();
  }
  // Download PDF
  // exportVanPDF() {
  //   var prepare=[];
  //   this.listOfData.forEach(e=>{
  //     var tempObj =[];
  //     tempObj.push(e.ID);
  //     tempObj.push(e.cdCode);
  //     tempObj.push(e.vehicleType);
  //     tempObj.push(e.plateNumber);
  //     tempObj.push( e.userName);
  //     tempObj.push(e.salespersonId);
  //     tempObj.push(e.createdBy);
  //     tempObj.push(e.createdOn);
  //     prepare.push(tempObj);
  //   });
  //   const doc = new jsPDF('l', 'mm', 'a4',);
  //   var fontSize = 12; 
  //   var imageUrl = "./assets/images/iko-stock-logo.png";
  //   doc.setFontSize(fontSize);
  //   doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
  //   doc.text("VAHICLE LIST",  130, 48,);
  //   autoTable(doc, {
  //       head: [['#','CD CODE','VAN TYPE','PLATE NUMBER','USER NAME','SALES PERSON','CREATED BY','CREATED ON']],
  //       margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
  //       body: prepare,
  //       startY: 60,
  //       theme: 'striped',
  //       headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
  //       foot: [['','','', '','@Eclectics International',' ','','',]],
  //       footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
  //       bodyStyles: {minCellHeight: 10, fontSize: 9.5}
  //   });

  //   doc.save('Van_List' + '.pdf');
  // }
     //export PDF file

     exportVehiclesPDF(){
      let element = 'table'
       let PDFTitle = 'Vehicles List';
       this.global.exportPDF(element, 'Vehicles', PDFTitle);

    }
    //export excel file
    exportVehiclesExcel(){
      let element = document.getElementById('vehiclesTable');
      this.global.exportTableElmToExcel(element, 'Vehicles');
    }

    //export csv file
    exportVehiclesCSV(){
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
