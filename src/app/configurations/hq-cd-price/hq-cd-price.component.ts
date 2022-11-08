import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddPriceComponent } from '../add-price/add-price.component';

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
  selector: 'app-hq-cd-price',
  templateUrl: './hq-cd-price.component.html',
  styleUrls: ['./hq-cd-price.component.scss']
})
export class HqCdPriceComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','TERRITORY_CODE','TERRITORY_NAME','TERRITORY_MANAGER','CREATED_BY','REMARKS','ACTIONS'];
  
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';
  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';
  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';


  mandatoryColumns: any[] = ["territoryCode", "territoryName", "createdBy", "remarks", "territoryManager"];
  
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
  updatePrice: boolean;
  priceDetails: any;
  page: number = 0;
  perPage: number = 10;
  total: number;
  searchValue: string = '';
  visible: boolean = false;
  listOfData: any[] = [];
  listOfDisplayData: any;
  searchInput: string = '';
  searchfullName: string = '';
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
  price: any;

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
    this.loadPrices();
  }
  //opens creation modal
  triggerModal(data: any): void {
    this.updatePrice = false;
    this.priceDetails = data;
    const dialogRef = this.dialog.open(AddPriceComponent, {data: {data: this.priceDetails, updatePrice: this.updatePrice}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadPrices();
    })
  }

  //open price update modal
  edit(data: any): void {
    this.priceDetails = data;
    this.updatePrice = true;
    const dialogRef = this.dialog.open(AddPriceComponent, {data: {data: this.priceDetails, updatePrice: this.updatePrice}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadPrices();
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
          this.loadPrices();
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
  //       this.loadTerritories();
  //     });
  // }

  loadPrices() {
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

//     this.httpService.get("config/hq-cd-prices", this.page, this.perPage).subscribe(res => {
//       if (res['responseCode'] == 200 || res['responseCode'] == 201) {
//         this.loading = false;
//         this.listOfData = res['data'];
//         console.log('hq-cd-prices');
//         console.log(this.listOfData);

//         // @ts-ignore
//         this.dataSource= new MatTableDataSource(this.listOfData);
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//         this.total = res['totalCount'];

//         this.listOfData.map((value, i) => {
//           value.ID = (this.page - 1) * this.perPage + i + 1;
//         })

//         this.listOfDisplayData = [...this.listOfData];
//         console.log("list of Data", this.listOfDisplayData);
        
//         let columns = [];
//         this.listOfData.map(item => {
//           Object.keys(item).map(itemKeys => {
//             columns.push(itemKeys);
//           })
//         });
//         this.columnsToExport = Array.from(new Set(columns));
// //         this.columnsToExport.map(item => {
// //           switch (item) {
      
// //        case 'territoryCode':
// //           this.columnsJson['territoryCode'] = 'territoryCode';
// //           break;
// //        case 'territoryName':
// //           this.columnsJson['territoryName'] = 'territoryName';
// //           break;
// //        case 'createdBy':
// //           this.columnsJson['createdBy'] = 'createdBy';
// //           break;
// //       case 'remarks':
// //           this.columnsJson['remarks'] = 'remarks';
// //           break;
// //         case 'territoryManager':
// //           this.columnsJson['territoryManager'] = 'territoryManager';
// //           break;
      
// //        default:
// //     break;
// // }
// //    });
// this.displayColumns = Object.keys(this.columnsJson);
// this.loading = false;
//  }
//  })

}

//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
  const { pageSize, pageIndex } = params;
  this.page = pageIndex;
  this.perPage = pageSize;
  this.loadPrices();
}

selectedColumns(event): void {
  this.mandatoryColumns = event;
}
reset(): void {
  this.searchValue = '';
  this.search();
}

search(): void {
  this.visible = false;
  this.listOfDisplayData = this.listOfData.filter((item) =>
    item.FullName.toLowerCase().indexOf(this.searchValue) !== -1
  );
}

statusSearch(){
  // this.visible = false;
  console.log(this.searchStatus)
  if (this.searchStatus == false) {
    this.allStatus = false;
  }
  this.listOfDisplayData = this.listOfData.filter(item =>
    item.Active == this.searchStatus);
}
removeStatusFilter(){
  // this.visible = false;
  this.listOfDisplayData = this.listOfData

}

userNameSearch(){
  if (this.searchValue.length < 1) {
    return this.loadPrices();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item) =>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if (this.searchEmail.length < 1) {
    return this.loadPrices();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item) =>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if (this.searchfullName.length < 1) {
    return this.loadPrices();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item) =>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
  if (this.searchInput.length < 1) {
    return this.loadPrices();
  } else {
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
  { def: 'TERRITORY_CODE', label: 'TERRITORY CODE', },
  { def: 'TERRITORY_NAME', label: 'TERRITORY NAME', },
  { def: 'TERRITORY_MANAGER', label: 'TERRITORY MANAGER', },
  { def: 'CREATED_BY', label: 'CREATED BY', },
  { def: 'REMARKS', label: 'REMARKS', },
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
    this.loadPrices();
  }

  handleOkAdd(): void {
    this.addNewPricing();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadPrices();
    this.price = element;
    this.formEdit = this.formBuilder.group(this.price);
    this.isVisibleEdit = true;
    console.log(this.price)
  }

  handleOkEdit(): void {
    this.editPricing();
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancelEdit(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }
   
  showDeleteConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Delete outlet',
      nzContent: '<p style="color: red;">Are you sure you want to delete this pricing?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

 addNewPricing(){
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
 editPricing(){
  const model = {
    assetNumber: this.formAdd.value.assetNumber,
    coolerSize: this.formAdd.value.coolerSize,
    model: this.formAdd.value.model,
    serialNumber: this.formAdd.value.serialNumber,
    status: this.formAdd.value.status,
    id: this.price['id'],
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
    this.loadPrices();
  })
 }

  // Download PDF
  exportHQPricesPDF() {
    let element = 'table'
    let PDFTitle = 'Hq Distributor Prices';
   this.global.exportPDF(element, 'Hq Distributor Prices', PDFTitle);
}

//export excel file
 exportHQPricesExcel(){
  let element = document.getElementById('hqPricesTable');
  this.global.exportTableElmToExcel(element, 'Hq Distributor Prices');
 }
 //export csv file
 exportHQPricesCSV(){
  this.global.exportToCsv(this.listOfDataToDisplay,
    'Hq Distributor Prices', ['id', 
    'model',
    'serialNumber',
    'assetNumber',
    'status', 
    'createdBy',
    'createdOn',
    ]);
 }
}

