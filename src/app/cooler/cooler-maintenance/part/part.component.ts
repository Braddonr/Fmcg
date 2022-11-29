import { AddSparePartComponent } from './../add-spare-part/add-spare-part.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../../dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','NAME','COOLER_ID','PRICE','CURRENCY','DESCRIPTION','CREATED_BY','Actions'];
  
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

 
  mandatoryColumns: any[] = [
    "sparePartName",
    "sparePartDescription",
    "currency",
    "price",
    "createdBy"
  ];

  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Cooler ID', status: true },
    { name: 'Sparepart Name', status: true },
    { name: 'Sparepart Description', status: true },
    { name: 'Currency', status: true },
    { name: 'Price', status: true },
    { name: 'Created By', status: false },
    // { name: 'Created On', status: true },
    { name: 'Remarks', status: false },
    { name: 'Actions', status: true },
  ]
    columnsJson: any = {};
    columnsToExport: string[] = [];
    displayColumns: any[];
    usersColumns: string[];
    usersRows: any[];
    updateSpare: boolean;
    spareDetails:any;
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
    part: any;
    coolerIds: any[] = [];

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
        coolerId:new FormControl('', [<any>Validators.required]),
        currency:new FormControl('', [<any>Validators.required]),
        price:new FormControl('', [<any>Validators.required]),
        sparePartDescription:new FormControl('', [<any>Validators.required]),
        sparePartName: new FormControl('', [<any>Validators.required]),
      }); 
      this.loadCoolerSpareParts();
    }

    //opens creation modal
  triggerModal(data: any): void {
    this.updateSpare = false;
    this.spareDetails = data;
    const dialogRef = this.dialog.open(AddSparePartComponent, {data: {data: this.spareDetails, updateSpare: this.updateSpare}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadCoolerSpareParts();
    })
  }

  //open company update modal
  edit(data: any): void {
    this.spareDetails = data;
    this.updateSpare = true;
    const dialogRef = this.dialog.open(AddSparePartComponent, {data: {data: this.spareDetails, updateSpare: this.updateSpare}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadCoolerSpareParts();
    })
  }
  
  // Delete Confirmation Dialog
  delete(element): void {
    const snack = this.snackBar;

    this.loading = true;
    this.httpService.deleteById("cooler/maintenance/part/delete", element.id)
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
          this.loadCoolerSpareParts();
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
    this.router.navigate(['/distributors/view-sparepart', element.id]);
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
  //       this.loadCoolerSpareParts();
  //     });
  // }
  
  loadCoolerSpareParts(){
    this.loading = true;
// //use local server as endpoints are down
//  this.httpService.getMockData()
//  .subscribe(res => {
  
//   this.loading = false;
//   this.listOfData = res
//   // console.log('Cooler-Companies');
//   // console.log(this.listOfData);

//   this.listOfDataToDisplay = [...this.listOfData];
// });
   
    this.httpService.get("cooler/maintenance/part", this.page, this.perPage).subscribe(res => {
     if(res['responseCode'] == 200 || res['responseCode'] == 201){
       this.loading = false;
     this.listOfData = res['data'];
     console.log('Cooler-Parts');
     console.log(this.listOfData);
    

     this.listOfDataToDisplay = [...this.listOfData];

      
     this.listOfData.map((x: any) => {
      if(!this.coolerIds.includes(x.coolerId)){
      this.coolerIds.push(x.coolerId)
     }
    })
    console.log(this.coolerIds);


     //fetch all cooler IDs to be used in adding cooler part
    //  this.httpService.get("cooler/maintenance/part", 1, 10).subscribe(res => {
    //   this.coolerIds = res['data'];
    //   console.log('Ids');
    //   console.log(this.coolerIds);
    //   });


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
     console.log(this.listOfData)
     
    //  console.log(columns)
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
   this.loadCoolerSpareParts();
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
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item)=>
        item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
      );
    }
  }
  emailSearch(){
    if(this.searchEmail.length < 1){
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item)=>
        item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
      );
    }
  }
  fullnameSearch(){
    if(this.searchfullName.length < 1){
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item)=>
        item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
      );
    }
  }
  
  globalSearch(){
   if(this.searchInput.length < 1){
  return this.loadCoolerSpareParts();
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
  { def: 'NAME', label: 'Name', },
  { def: 'COOLER_ID', label: 'COOLER_ID', },
  { def: 'PRICE', label: 'Price', },
  { def: 'CURRENCY', label: 'Currency', },
  { def: 'DESCRIPTION', label: 'Description', },
  { def: 'CREATED_BY', label: 'Created By', },
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
    this.loadCoolerSpareParts();
  }

  handleOkAdd(): void {
    this.addNewCoolerSpareParts();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadCoolerSpareParts();
    this.part = element;
    this.formEdit = this.formBuilder.group(this.part);
    this.isVisibleEdit = true;
    console.log(this.part)
  }

  handleOkEdit(): void {
    this.editCoolerSpareParts();
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
      nzTitle: 'Delete cooler part',
      nzContent: '<p style="color: red;">Are you sure you want to delete this spare part?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  addNewCoolerSpareParts(){
    this.httpService.post("cooler/maintenance/part/add", this.formAdd.value)
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

  editCoolerSpareParts(){
    const model = {
      coolerId: this.formEdit.value.coolerId,
      currency: this.formEdit.value.currency,
      price: this.formEdit.value.price,
      sparePartDescription: this.formEdit.value.sparePartDescription,
      sparePartName: this.formEdit.value.sparePartName,
      id: this.part['id'],
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
    
    this.httpService.put("cooler/maintenance/part/edit", model)
    .subscribe({
      next:(res)=> { 
       let message: any;
       message = res['message']
        this.toastr.success(message, "Success!");
        this.formAdd.reset();
        this.loadCoolerSpareParts();
      },
      error:(err)=>{
       let errorMessage: any;
       errorMessage = err.error['message']
   
        this.toastr.error(errorMessage, "Error!");
      },
     })
  }
  // Download PDF
  exportCoolerSparePartsPDF() {
    let element = 'table'
    let PDFTitle = 'Cooler Spare Parts';
   this.global.exportPDF(element, 'Cooler Spare Parts', PDFTitle);
}

//export excel file
 exportCooolerSparePartsExcel(){
  let element = document.getElementById('coolerSparePartsTable');
  this.global.exportTableElmToExcel(element, 'Cooler Spare Parts');
 }
 //export csv file
 exportCooolerSparePartsCSV(){
  this.global.exportToCsv(this.listOfDataToDisplay,
    'Cooler Spare Parts', ['id', 
    'coolerId',
    'sparePartName',
    'sparePartDescription',
    'currency', 
    'price',
    'createdBy',
    'remarks',
    ]);
 }
}
