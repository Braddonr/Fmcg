import { DialogComponent } from '../dialog/dialog.component';
import { AddVanComponent } from './../add-van/add-van.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-all-vehicles',
  templateUrl: './all-vehicles.component.html',
  styleUrls: ['./all-vehicles.component.scss']
})
export class AllVehiclesComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','CD_CODE','Vehicle_Type','Plate_Number','User_Name','Sales_Person','Created_By','Created_On','Actions'];

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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.loadVehicles();
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
    const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });
    const snack = this.snackBar;

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log(element.id)
        // snack.dismiss();
        this.httpService.delete("distributor/delete-vehicle", element.id )
        .subscribe({
        next:(res)=> {
          console.log(res)
          const a = document.createElement('a');
          a.click();
          a.remove();
          snack.dismiss();
          this.snackBar.open('Data deleted successfully', 'Eclectics International', {
            duration: 2000,
          });
          this.loadVehicles();
        },
        error:()=>{
          this.snackBar.open('Error deleting data', 'Eclectics International', {
            duration: 2000,
          }); 
        },

        })
      }
    });
  }





  viewUserDetails(data: any) {
    
    localStorage.setItem('user', JSON.stringify(data))
    this.router.navigate(["user-profile/list-users/", data.Id], { skipLocationChange: true });
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
   console.log('all vehicles');
   console.log(this.listOfData);

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
 
show_hide_details() {

  this.showHideDetails= !this.showHideDetails;
  }

  show_hide_ID() {
    this.showHideID = !this.showHideID;
    } 
  show_hide_code() {
      this.showHideCode = !this.showHideCode;
    }
  show_hide_vehicleType(){
      this.showHideVehicleType = !this.showHideVehicleType;
    }
  show_hide_plateNumber(){
      this.showHidePlateNumber = !this.showHidePlateNumber;
    }
  show_hide_userName(){
      this.showHideUserName = !this.showHideUserName;
    }
  show_hide_salesPerson(){
      this.showHideSalesPerson = !this.showHideSalesPerson;
    }
  show_hide_createdby(){
      this.showHideCreatedBy = !this.showHideCreatedBy ;
    }
  show_hide_createdon(){
      this.showHideCreatedOn = !this.showHideCreatedOn;
    }
  show_hide_actions(){
      this.showHideAction = !this.showHideAction;
    }

  // Download PDF
  exportVanPDF() {
    var prepare=[];
    this.listOfData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.ID);
      tempObj.push(e.cdCode);
      tempObj.push(e.vehicleType);
      tempObj.push(e.plateNumber);
      tempObj.push( e.userName);
      tempObj.push(e.salespersonId);
      tempObj.push(e.createdBy);
      tempObj.push(e.createdOn);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'mm', 'a4',);
    var fontSize = 12; 
    var imageUrl = "./assets/images/iko-stock-logo.png";
    doc.setFontSize(fontSize);
    doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
    doc.text("VAHICLE LIST",  130, 48,);
    autoTable(doc, {
        head: [['#','CD CODE','VAN TYPE','PLATE NUMBER','USER NAME','SALES PERSON','CREATED BY','CREATED ON']],
        margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
        body: prepare,
        startY: 60,
        theme: 'striped',
        headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
        foot: [['','','', '','@Eclectics International',' ','','',]],
        footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
        bodyStyles: {minCellHeight: 10, fontSize: 9.5}
    });

    doc.save('Van_List' + '.pdf');
  }


}
