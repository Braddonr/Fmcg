import { AddVanStockComponent } from './../add-van-stock/add-van-stock.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormGroup, FormControl } from '@angular/forms';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateVanStock: boolean;
  vanStockDetails: any;
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

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadVehicles();
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
   console.log('van-stock-list');
   console.log(this.listOfData);

   // @ts-ignore
   this.dataSource= new MatTableDataSource();
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

show_hide_details() {

  this.showHideDetails= !this.showHideDetails;
  }

  // Download PDF
  exportVanStockPDF() {
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
      tempObj.push(e.createdOn);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'mm', 'a4',);
    var fontSize = 12; 
    var imageUrl = "./assets/images/iko-stock-logo.png";
    doc.setFontSize(fontSize);
    doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
    doc.text("VAN STOCK LIST",  126, 48,);
    autoTable(doc, {
        head: [['#','DEPORT','CREATED ON','STOCK NUMBER','VALUE(UGX)','ROUTE','CR NAME','PLATE NUMBER','APPROVED']],
        margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
        body: prepare,
        startY: 60,
        theme: 'striped',
        headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
        foot: [['','','', '','@Eclectics International',' ','','',]],
        footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
        bodyStyles: {minCellHeight: 10, fontSize: 9.5}
    });

    doc.save('Van_Stock_List' + '.pdf');
  }



}

