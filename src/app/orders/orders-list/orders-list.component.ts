import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddOrderComponent } from '../add-order/add-order.component';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','CREDIT_CODE','CREDIT_NAME','PRODUCT_CODE','DESCRIPTION','ORDER_REF','ORDER_QUANTITY','ORDER_VALUE','PAY_MODE','PAYMENT_PROOF','STATUS','ACTIONS'];
  
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
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort


  mandatoryColumns: any[] = ["cdCode", "cdName", "productCode", "productDescription", "orderRef", "orderQuantity", "orderValue", "modeOfPayment", "proofOfPayment", "status"];
  
  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Cooler Model', status: true },
    { name: 'Serial Number', status: true },
    { name: 'Asset Number', status: true },
    { name: 'Status', status: true },
    { name: 'Created By', status: false },
    { name: 'Created On', status: true },
    { name: 'Actions', status: true },
  ]
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

  showAll = false;

  searchTerm = '';
  totalCoolers: any;
  listOfDataToDisplay: any = [];

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
  order: any;
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
  ) {}

  ngOnInit() {
    this.formAdd = this.formBuilder.group({
      assetNumber:new FormControl('', [<any>Validators.required]),
      coolerSize:new FormControl('', [<any>Validators.required]),
      model:new FormControl('', [<any>Validators.required]),
      serialNumber:new FormControl('', [<any>Validators.required]),
      status: new FormControl('', [<any>Validators.required]),
    });
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
  delete(element) {
   const snack = this.snackBar;

    this.loading = true;
    this.httpService.delete("cooler/maintenance/company/delete", element.id)
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
          this.loadOrders();
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
    this.router.navigate(['/distributors/view-company', element.id]);
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

  
//use local server as endpoints are down
 this.httpService.getMockData()
 .subscribe(res => {
  
  this.loading = false;
  this.listOfData = res
  // console.log('Cooler-Companies');
  // console.log(this.listOfData);

  this.listOfDataToDisplay = [...this.listOfData];
});

//  this.httpService.get("order/all", this.page, this.perPage).subscribe(res => {
//    console.log(res);
   
//    if(res['responseCode'] == 200 || res['responseCode'] == 0){
      
//      this.loading = false;
//    this.listOfData = res['data'];
//    console.log('Order-list');
//    console.log(this.listOfData);
   
//    // @ts-ignore
//    this.dataSource= new MatTableDataSource(this.listOfData);
//    this.dataSource.paginator = this.paginator
//    this.dataSource.sort = this.sort
//    this.total = res['totalCount'];

//    this.listOfData.map((value, i) => {
   
//     value.ID = (this.page) * this.perPage + i+1;
//   })

//    this.listOfDisplayData = [...this.listOfData];
//    let columns = [];
//    this.listOfData.map(item => {
//      Object.keys(item).map(itemKeys => {
//        columns.push(itemKeys);
//      })
//    });
//    this.columnsToExport = Array.from(new Set(columns));
//    this.columnsToExport.map(item =>{
//      switch(item){
      
//        case 'cdCode':
//          this.columnsJson['cdCode'] = 'cdCode';
//          break;
//        case 'cdName': 
//          this.columnsJson['cdName'] = 'cdName';
//          break;
//        case 'productCode':
//          this.columnsJson['productCode'] = 'productCode';
//          break;
//          case 'productDescription':
//          this.columnsJson['productDescription'] = 'productDescription';
//          break;
//          case 'orderQuantity':
//          this.columnsJson['orderQuantity'] = 'orderQuantity';
//          break;
//          case 'orderValue':
//          this.columnsJson['orderValue'] = 'orderValue';
//          break;
//          case 'modeOfPayment':
//          this.columnsJson['modeOfPayment'] = 'modeOfPayment';
//          break;
//          case 'proofOfPayment':
//          this.columnsJson['proofOfPayment'] = 'proofOfPayment';
        
//       case 'status':
//         this.columnsJson['status'] = 'status';
      
//        default: 
//        break;
//      }
//    });
//    this.displayColumns = Object.keys(this.columnsJson);
//    this.loading=false;
//  }
//  })
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


   //date picker
   onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

  //open nzAddModal 
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.loadOrders();
  }

  handleOkAdd(): void {
    this.addNewOrder();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

 handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadOrders();
    this.order = element;
    this.formEdit = this.formBuilder.group(this.order);
    this.isVisibleEdit = true;
    console.log(this.order)
  }

  handleOkEdit(): void {
    this.editOrder();
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
      nzContent: '<p style="color: red;">Are you sure you want to delete this order?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  addNewOrder(){
    this.httpService.post("cooler/maintenance/company/add", this.formAdd.value)
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
   editOrder(){
    const model = {
      assetNumber: this.formAdd.value.assetNumber,
      coolerSize: this.formAdd.value.coolerSize,
      model: this.formAdd.value.model,
      serialNumber: this.formAdd.value.serialNumber,
      status: this.formAdd.value.status,
      id: this.order['id'],
      // previousData: {
      //   cdName: this.cooler["cdName"],
      //   cdCode: this.cooler["cdCode"],
      //   cdContactFullName: this.cooler["cdContactFullName"],
      //   cdEmail: this.cooler["cdEmail"],
      //   regionCode: this.cooler["regionCode"],
      //   territoryCode: this.cooler["territoryCode"],
      //   remarks: this.cooler["remarks"]
      // }
    };
    
    this.httpService.put("cooler/maintenance/company/edit", model).subscribe
    
    (res => {
      let message: any;
      message = res['message'];
      if (res['responseCode'] == 200) {
        if(res['message']==="Edited successfully"){
          this.toastr.success(message, "Success!");
        }
        else{
          this.toastr.error(message, "Error!");
        }
       
      } 
      else {
        let errorMessage: any;
        errorMessage = res["message"]
        this.toastr.error(errorMessage, "Error!");
        
      }
      this.loadOrders();
    })
   }
  
    // Download PDF
    exportOrdersPDF() {
      let element = 'table'
      let PDFTitle = 'Orders';
     this.global.exportPDF(element, 'Orders', PDFTitle);
  }
  
  //export excel file
   exportOrdersExcel(){
    let element = document.getElementById('ordersTable');
    this.global.exportTableElmToExcel(element, 'Orders');
   }
   //export csv file
   exportOrdersCSV(){
    this.global.exportToCsv(this.listOfDataToDisplay,
      'Orders', ['id', 
      'model',
      'serialNumber',
      'assetNumber',
      'status', 
      'createdBy',
      'createdOn',
      ]);
   }

}
