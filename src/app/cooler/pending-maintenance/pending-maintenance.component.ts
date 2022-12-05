import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-pending-maintenance',
  templateUrl: './pending-maintenance.component.html',
  styleUrls: ['./pending-maintenance.component.scss']
})
export class PendingMaintenanceComponent implements OnInit {

   //define tool tip properties
   @Input() toolTipViewTitle: string = "View";
   @Input() toolTipViewColor: string = "blue";
   @Input() toolTipViewPosition = 'bottom';
 
   @Input() toolTipEditTitle: string = "Approve";
   @Input() toolTipEditColor: string = "green";
   @Input() toolTipEditPosition = 'bottom';
 
   @Input() toolTipDeleteTitle: string = "Deallocate";
   @Input() toolTipDeleteColor: string = "red";
   @Input() toolTipDeletePosition = 'bottom';

   @Input() toolTipReallocateTitle: string = "Reallocate";
   @Input() toolTipReallocateColor: string = "orange";
   @Input() toolTipReallocatePosition = 'bottom';
 
   checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Company Name', status: true },
    { name: 'Contact Name', status: true },
    { name: 'Email', status: true },
    { name: 'Location', status: true },
    { name: 'Contact Phone', status: true },
    { name: 'Created By', status: true },
    // { name: 'Created On', status: true },
    { name: 'Remarks', status: false },
    { name: 'Actions', status: true },
  ]
  checkList2: any[] = [
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

  page: number = 0;
  perPage: number = 10;
  total: number;
  searchValue: string = '';
  visible: boolean = false;
  listOfAllocations: any[] = [];
  listOfUnallocations: any[] = [];
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

  showAll = false;
  showAll2 = false;
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  status: boolean = false;
  searchTerm = '';
  totalUnapprovedCompanies: any;
  totalUnapprovedParts: any;
  listOfUnapprovedCompanies: any = [];
  listOfUnapprovedParts: any = [];
  listOfUnapprovedCompaniesToDisplay: any = [];
  listOfUnapprovedPartsToDisplay: any = [];


  constructor(
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private toastr : ToastrService,
    private modal: NzModalService,
    private global : GlobalService
  ) { }

  ngOnInit(): void {
    this.loadUnapprovedCoolerCompanies();
    this.loadUnapprovedCoolerParts();
  }

loadUnapprovedCoolerCompanies(){
  
//use local server as endpoints are down
this.httpService.getMockData()
.subscribe(res => {
 
 this.loading = false;
 this.listOfUnapprovedCompanies = res
 // console.log('Cooler-Companies');
 // console.log(this.listOfData);

 this.listOfUnapprovedCompaniesToDisplay = [...this.listOfUnapprovedCompanies];
});

  // this.loading = true;
  // this.httpService.getPending("cooler/maintenance/company",  this.page, this.perPage, this.status).subscribe(res => {
  //   if(res['responseCode'] == 200){
  //   this.loading = false;
  //   this.listOfUnapprovedCompanies = res['data'];
  //   this.totalUnapprovedCompanies = res['totalCount'];
  //   console.log(this.listOfUnapprovedCompanies);
    
 
  //   this.listOfUnapprovedCompaniesToDisplay = [...this.listOfUnapprovedCompanies];
  //   }
  //   this.loading = false;
  // })
}
loadUnapprovedCoolerParts(){
 
//use local server as endpoints are down
this.httpService.getMockData()
.subscribe(res => {
 
 this.loading = false;
 this.listOfUnapprovedParts = res
 // console.log('Cooler-Companies');
 // console.log(this.listOfData);

 this.listOfUnapprovedPartsToDisplay = [...this.listOfUnapprovedParts];
});

  // this.loading = true;
  // this.httpService.getPending("cooler/maintenance/part",  this.page, this.perPage, this.status).subscribe(res => {
  //   if(res['responseCode'] == 200){
  //   this.loading = false;
  //   this.listOfUnapprovedParts = res['data'];
  //   this.totalUnapprovedParts = res['totalCount'];
  //   console.log(this.listOfUnapprovedParts);
    
 
  //   this.listOfUnapprovedPartsToDisplay = [...this.listOfUnapprovedParts];
  //   }
  //   this.loading = false;
  // })
}
//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
  const {pageSize, pageIndex} = params;
  this.page = pageIndex;
  this.perPage = pageSize;
 //  this.loadProducts();
 }

 approveCompany(element): void{
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
      this.loadUnapprovedCoolerCompanies();
    })
}
approvePart(element): void{
  console.log(element.id);
  
  this.httpService.approveById("cooler/maintenance/part/approve", element.id) 
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
      this.loadUnapprovedCoolerParts();
    })
}

view(element): void {
  this.router.navigate(['/distributors/view-distributor', element.id]);
}

// for unapproved companies table
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
//for unapproved parts table
show_hide_all2() {
  this.checkList2.forEach(item => {
      item.status = this.showAll2
  });
}
 showHideColumn2(name: string): boolean {
  let temp2 = this.checkList2.filter(item => item.name == name);
  return temp2[0].status
}

toggleStatus2(name: string) {
  this.checkList2.forEach(item => {
    if (item.name == name) {
      item.status = !item.status
    }
      this.showAll2 = false;
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

 //export Unapproved Cooler Companies PDF

 exportUnapprovedCompaniesPDF(){
  let element = 'table'
   let PDFTitle = 'Unapproved Cooler Maintenance Companies';
   this.global.exportPDF(element, 'Unapproved Cooler Maintenance Companies', PDFTitle);
}

//export Unapproved Cooler Parts PDF

exportUnapprovedPartsPDF(){
  let element = 'table'
   let PDFTitle = 'Unapproved Cooler Parts';
   this.global.exportPDF(element, 'Unapproved Cooler Parts', PDFTitle);
}

//export Unapproved Cooler Companies excel file
exportUnapprovedCompaniesExcel(){
  let element = document.getElementById('unapprovedCompaniesTable');
  this.global.exportTableElmToExcel(element, 'Unapproved Cooler Companies');
}

 //export  Unapproved Cooler Parts excel file
 exportUnapprovedPartsExcel(){
  let element = document.getElementById('unapprovedPartsTable');
  this.global.exportTableElmToExcel(element, 'Unapproved Cooler Parts');
}



//export Unapproved Cooler Companies csv file
exportUnapprovedCompaniesCSV(){
  this.global.exportToCsv(this.listOfUnapprovedCompaniesToDisplay,
  'Unapproved Cooler Companies', ['id', 
  'companyName',
  'contactName',
  'contactPhone',
  'email',
  'location',
  'createdBy',
  'remarks',
  ]);
}

//export Unapproved Cooler Parts csv file
exportUnapprovedPartsCSV(){
  this.global.exportToCsv(this.listOfUnapprovedPartsToDisplay,
  'Unapproved Cooler Parts', ['id', 
  'coolerSize',
  'serialNumber',
  'assetNumber',
  'status', 
  'createdBy',
  'createdOn',
  'remarks'
  ]);
}



}
