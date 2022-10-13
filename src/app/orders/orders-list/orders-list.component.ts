import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddOrderComponent } from '../add-order/add-order.component';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','CREDIT_CODE','CREDIT_NAME','PRODUCT_CODE','DESCRIPTION','ORDER_REF','ORDER_QUANTITY','ORDER_VALUE','PAY_MODE','PAYMENT_PROOF','STATUS','ACTIONS'];
  
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort


  mandatoryColumns: any[] = ["cdCode", "cdName", "productCode", "productDescription", "orderRef", "orderQuantity", "orderValue", "modeOfPayment", "proofOfPayment", "status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateOrder: boolean;
  orderDetails: any;
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
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadOrders();
  }
  //opens creation modal
  triggerModal(data: any): void {
    this.updateOrder = false;
    this.orderDetails = data;
    const dialogRef = this.dialog.open(AddOrderComponent, {data: {data: this.orderDetails, updateOrder: this.updateOrder}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadOrders();
    })
  }

  //open order update modal
  edit(data: any): void {
    this.orderDetails = data;
    this.updateOrder = true;
    const dialogRef = this.dialog.open(AddOrderComponent, {data: {data: this.orderDetails, updateOrder: this.updateOrder}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadOrders();
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
//       this.loadOrders();
//     });
// }

loadOrders(){
  this.loading = true;
 this.httpService.get("order/all", this.page, this.perPage).subscribe(res => {
   console.log(res);
   
   if(res['responseCode'] == 200 || res['responseCode'] == 0){
      
     this.loading = false;
   this.listOfData = res['data'];
   console.log('Order-list');
   console.log(this.listOfData);
   
   // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort
   this.total = res['totalCount'];

   this.listOfData.map((value, i) => {
   
    value.ID = (this.page) * this.perPage + i+1;
  })

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
      
       case 'cdCode':
         this.columnsJson['cdCode'] = 'cdCode';
         break;
       case 'cdName': 
         this.columnsJson['cdName'] = 'cdName';
         break;
       case 'productCode':
         this.columnsJson['productCode'] = 'productCode';
         break;
         case 'productDescription':
         this.columnsJson['productDescription'] = 'productDescription';
         break;
         case 'orderQuantity':
         this.columnsJson['orderQuantity'] = 'orderQuantity';
         break;
         case 'orderValue':
         this.columnsJson['orderValue'] = 'orderValue';
         break;
         case 'modeOfPayment':
         this.columnsJson['modeOfPayment'] = 'modeOfPayment';
         break;
         case 'proofOfPayment':
         this.columnsJson['proofOfPayment'] = 'proofOfPayment';
        
      case 'status':
        this.columnsJson['status'] = 'status';
      
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
 this.loadOrders();
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
    return this.loadOrders();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    return this.loadOrders();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    return this.loadOrders();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
return this.loadOrders();
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


columnDefinitions = [
  { def: 'Position', label: 'Position', },
  { def: 'ID', label: 'ID', },
  { def: 'CREDIT_CODE', label: 'CREDIT_CODE', },
  { def: 'CREDIT_NAME', label: 'CREDIT_NAME', },
  { def: 'PRODUCT_CODE', label: 'PRODUCT_CODE', },
  { def: 'DESCRIPTION', label: 'DESCRIPTION', },
  { def: 'ORDER_REF', label: 'ORDER_REF', },
  { def: 'ORDER_QUANTITY', label: 'ORDER_QUANTITY', },
  { def: 'ORDER_VALUE', label: 'ORDER_VALUE', },
  { def: 'PAY_MODE', label: 'PAY_MODE', },
  { def: 'PAYMENT_PROOF', label: 'PAYMENT_PROOF', },
  { def: 'STATUS', label: 'STATUS', },
]

show_hide_details() {

  this.showHideDetails= !this.showHideDetails;
  }

  // Download PDF
  exportOderPDF() {
    var prepare=[];
    this.listOfData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.ID);
      tempObj.push(e.cdCode);
      tempObj.push(e.cdName);
      tempObj.push(e.productCode);
      tempObj.push( e.productDescription);
      tempObj.push(e.orderRef);
      tempObj.push(e.orderQuantity);
      tempObj.push(e.orderValue);
      tempObj.push(e.modeOfPayment);
      tempObj.push(e.status);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'mm', 'a4',);
    var fontSize = 12; 
    var imageUrl = "./assets/images/iko-stock-logo.png";
    doc.setFontSize(fontSize);
    doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
    doc.text("ORDER LIST",  130, 48,);
    autoTable(doc, {
        head: [['#','CD CODE','CD NAME','PRODUCT CODE','DESCRIPTION','ODER REF','QUANTITY','VALUE','PAY MODE','STATUS']],
        margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
        body: prepare,
        startY: 60,
        theme: 'striped',
        headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
        foot: [['','','', '','@Eclectics International',' ','','',]],
        footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
        bodyStyles: {minCellHeight: 10, fontSize: 9.5}
    });

    doc.save('Oder_List' + '.pdf');
  }


}
