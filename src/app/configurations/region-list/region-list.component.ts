import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddRegionComponent } from '../add-region/add-region.component';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss']
})
export class RegionListComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','REGION_CODE','REGION_NAME','CREATED_ON','CREATED_BY','REMARKS'];
  
   
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

  mandatoryColumns: any[] = ["regionCode", "regionName", "createdOn", "createdBy", "remarks"];
  
  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Region Code', status: true },
    { name: 'Region Name', status: true },
    { name: 'Region Description', status: true },
    { name: 'Governor Id', status: false },
    { name: 'Pg First Name', status: true },
    { name: 'Pg Last Name', status: true },
    { name: 'Pg Email', status: true },
    { name: 'Actions', status: true },
  ]

  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateRegion: boolean;
  regionDetails: any;
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

  colspan : 7;

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
  region: any;
  governorIds: any[]= [];

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
      governorId:new FormControl('', [<any>Validators.required]),
      pgEmail:new FormControl('', [<any>Validators.required]),
      pgFirstName:new FormControl('', [<any>Validators.required]),
      pgLastName:new FormControl('', [<any>Validators.required]),
      regionCode: new FormControl('', [<any>Validators.required]),
      regionDescription: new FormControl('', [<any>Validators.required]),
      regionName: new FormControl('', [<any>Validators.required]),
      remarks: new FormControl('', [<any>Validators.required])
    });
    this.loadProducts();
  }
  //opens creation modal
  triggerModal(data: any): void {
    this.updateRegion = false;
    this.regionDetails = data;
    const dialogRef = this.dialog.open(AddRegionComponent, {data: {data: this.regionDetails, updateRegion: this.updateRegion}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadProducts();
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
  //     this.loadProducts()
  //   });
  // }


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
//       this.loadProducts();
//     });
// }
// Delete Confirmation Dialog
delete(element): void {
  const snack = this.snackBar;

  this.loading = true;
  this.httpService.delete("config/delete-region", element.id)
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
        this.loadProducts();
      },
      error: () => {
        this.snackBar.open('Error deleting data', 'Eclectics International', {
          duration: 2000,
        });
        this.loading= false;
      }
    })
}


loadProducts(){
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

 this.httpService.getNoParams("config/region/all").subscribe(res => {
   if(res['status'] = "Success"){
     this.loading = false;
   this.listOfData = res['data'];
   
   this.listOfData.map((x: any) => {
    if(!this.governorIds.includes(x.governorId)){
    this.governorIds.push(x.governorId)
   }
    })

   console.log(this.governorIds);
   console.log(this.listOfData);

   this.listOfDataToDisplay = [...this.listOfData];

   // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
   this.total = res['totalCount'];

   this.listOfData.map((value, i) => {
    value.ID = (this.page - 1) * this.perPage + i+1;
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
       case 'regionCode':
         this.columnsJson['regionCode'] = 'regionCode';
         break;
       case 'regionName': 
         this.columnsJson['regionName'] = 'regionName';
         break;
       case 'createdOn':
         this.columnsJson['createdOn'] = 'createdOn';
         break;
         case 'createdBy':
           this.columnsJson['createdBy'] = 'createdBy';
           break;
      case 'remarks':
        this.columnsJson['remarks'] = 'remarks';
        break;
      
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
 this.loadProducts();
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
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
return this.loadProducts();
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
  { def: 'REGION_CODE', label: 'REGION CODE', },
  { def: 'REGION_NAME', label: 'REGION NAME', },
  { def: 'CREATED_ON', label: 'CREATED ON', },
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
    this.loadProducts();
  }

  handleOkAdd(): void {
    this.addNewRegion();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadProducts();
    this.region = element;
    this.formEdit = this.formBuilder.group(this.region);
    this.isVisibleEdit = true;
    console.log(this.region)
  }

  handleOkEdit(): void {
    this.editRegion();
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
      nzContent: '<p style="color: red;">Are you sure you want to delete this region?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

 addNewRegion(){
  this.httpService.post("config/region/add", this.formAdd.value)
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
 editRegion(){
  const model = {
    assetNumber: this.formEdit.value.assetNumber,
    coolerSize: this.formEdit.value.coolerSize,
    model: this.formEdit.value.model,
    serialNumber: this.formEdit.value.serialNumber,
    status: this.formEdit.value.status,
    id: this.region['id'],
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
  
  this.httpService.put("config/region/edit", model).subscribe
  
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
    this.loadProducts();
  })
 }

  // Download PDF
  exportRegionsPDF() {
    let element = 'table'
    let PDFTitle = 'Regions';
   this.global.exportPDF(element, 'Regions', PDFTitle);
}

//export excel file
 exportRegionsExcel(){
  let element = document.getElementById('regionsTable');
  this.global.exportTableElmToExcel(element, 'Regions');
 }
 //export csv file
 exportRegionsCSV(){
  this.global.exportToCsv(this.listOfDataToDisplay,
    'Regions', ['id', 
    'regionName',
    'regionCode',
    'regionDescription',
    'governorId', 
    'pgFirstName',
    'pgLastName',
    'pgEmail'
    ]);
 }
}
