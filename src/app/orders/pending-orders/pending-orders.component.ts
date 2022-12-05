import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddOrderComponent } from '../add-order/add-order.component';

@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss']
})
export class PendingOrdersComponent implements OnInit {

  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';
  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';
  @Input() toolTipDeleteTitle: string = "Approve";
  @Input() toolTipDeleteColor: string = "green";
  @Input() toolTipDeletePosition = 'bottom';

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort


  mandatoryColumns: any[] = ["cdCode", "cdName", "productCode", "productDescription", "orderRef", "orderQuantity", "orderValue", "modeOfPayment", "proofOfPayment", "status"];
  
  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Cd Code', status: false },
    { name: 'Cd Name', status: true },
    { name: 'Product Code', status: true },
    { name: 'Product Description', status: true },
    { name: 'Order Ref', status: true },
    { name: 'Order Quantity', status: true },
    { name: 'Order Value', status: true },
    { name: 'Mode of Payment', status: true },
    { name: 'Proof of Payment', status: true },
    { name: 'Status', status: true },
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

    this.loadUnapprovedOrders();
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

loadUnapprovedOrders(){
  this.loading = true;

  
//use local server as endpoints are down
//  this.httpService.getMockData()
//  .subscribe(res => {
  
//   this.loading = false;
//   this.listOfData = res
//   // console.log('Cooler-Companies');
//   // console.log(this.listOfData);

//   this.listOfDataToDisplay = [...this.listOfData];
// });

 this.httpService.get("order/sales-pending-approval", this.page, this.perPage).subscribe(res => {
   console.log(res);
   
   if(res['status'] = "Success"){
      
     this.loading = false;
   this.listOfData = res['data'];
   this.total = res['totalCount']
   console.log('Order-list');
   console.log(this.listOfData);

   this.listOfDataToDisplay = [...this.listOfData];
   }
 })
}

approveSale(element){

}
//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
 const {pageSize, pageIndex} = params;
 this.page = pageIndex;
 this.perPage = pageSize;
 this.loadUnapprovedOrders();
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

   //date picker
   onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }
  
  approveOrder(element): void{
    console.log(element.id)
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/maintenance/company/approve", id)
  .subscribe
    (res => {
      let message: any;
      message = res['message'];
      if (res['status'] = "Success") {
          this.toastr.success(message, "Success!");
      }
      else{
          this.toastr.error(message, "Error!");
        }
      this.loadUnapprovedOrders();
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
