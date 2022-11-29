import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-pending-distributors',
  templateUrl: './pending-distributors.component.html',
  styleUrls: ['./pending-distributors.component.scss']
})
export class PendingDistributorsComponent implements OnInit {

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
    { name: 'cdCode', status: false },
    { name: 'cdContactFullName', status: true },
    { name: 'cdContactMobileNumber', status: true },
    { name: 'cdEmail', status: true },
    { name: 'Distributor Name', status: true },
    { name: 'createdOn', status: true },
    { name: 'id', status: false },
    { name: 'regionCode', status: true },
    { name: 'territoryCode', status: false },
    { name: 'actions', status: true },
 ]
 checkList2: any[] = [
  { name: 'id', status: false },
  { name: 'cdCode', status: true },
  { name: 'vehicleType', status: true },
  { name: 'plateNumber', status: true },
  { name: 'userFirstName', status: false },
  { name: 'userLastName', status: false },
  { name: 'salesPersonId', status: false },
  { name: 'createdBy', status: false },
  { name: 'createdOn', status: true },
  { name: 'actions', status: true }
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

 status: boolean = false;
 searchTerm = '';
 totalUnapprovedDistributors: any;
 totalUnapprovedVehicles: any;
 listOfUnapprovedDistributors: any = [];
 listOfUnapprovedVehicles: any = [];
 listOfUnapprovedDistributorsToDisplay: any = [];
 listOfUnapprovedVehiclesToDisplay: any = [];


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
   this.loadUnapprovedDistributors();
   this.loadUnapprovedVehicles();
 }

 loadUnapprovedDistributors(){
 
//use local server as endpoints are down
this.httpService.getMockData()
.subscribe(res => {

this.loading = false;
this.listOfUnapprovedDistributors = res
// console.log('Cooler-Companies');
// console.log(this.listOfData);

this.listOfUnapprovedDistributorsToDisplay = [...this.listOfUnapprovedDistributors];
});

 // this.loading = true;
 // this.httpService.getPending("cooler/maintenance/company",  this.page, this.perPage, this.status).subscribe(res => {
 //   if(res['responseCode'] == 200){
 //   this.loading = false;
 //   this.listOfUnapprovedDistributors = res['data'];
 //   this.totalUnapprovedDistributors = res['totalCount'];
 //   console.log(this.listOfUnapprovedDistributors);
   

 //   this.listOfUnapprovedDistributorsToDisplay = [...this.listOfUnapprovedDistributors];
 //   }
 //   this.loading = false;
 // })
}
loadUnapprovedVehicles(){

//use local server as endpoints are down
this.httpService.getMockData()
.subscribe(res => {

this.loading = false;
this.listOfUnapprovedVehicles = res
// console.log('Cooler-Companies');
// console.log(this.listOfData);

this.listOfUnapprovedVehiclesToDisplay = [...this.listOfUnapprovedVehicles];
});

 // this.loading = true;
 // this.httpService.getPending("cooler/maintenance/part",  this.page, this.perPage, this.status).subscribe(res => {
 //   if(res['responseCode'] == 200){
 //   this.loading = false;
 //   this.listOfUnapprovedVehicles = res['data'];
 //   this.totalUnapprovedVehicles = res['totalCount'];
 //   console.log(this.listOfUnapprovedVehicles);
   

 //   this.listOfUnapprovedVehiclesToDisplay = [...this.listOfUnapprovedVehicles]; 
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

approveDistributor(element): void{
 console.log(element.id)
 const id = {
   id: element.id
 }
 this.httpService.put("distributor/approve", id)
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
     this.loadUnapprovedDistributors();
   })
}
approveVehicle(element): void{
 console.log(element.id);
 
 this.httpService.approveById("distributor/vehicle/approve", element.id) 
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
     this.loadUnapprovedVehicles();
   })
}

view(element): void {
 this.router.navigate(['/distributors/view-distributor', element.id]);
}

// for unapproved distributors table
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
//for unapproved vehicles table
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
//export Unapproved Distributors PDF

exportUnapprovedDistributorsPDF(){
 let element = 'table'
  let PDFTitle = 'Unapproved Distributors';
  this.global.exportPDF(element, 'Unapproved Distributors', PDFTitle);
}

//export Unapproved Vehicles PDF

exportUnapprovedVehiclesPDF(){
 let element = 'table'
  let PDFTitle = 'Unapproved Vehicles';
  this.global.exportPDF(element, 'Unapproved Vehicles', PDFTitle);
}

//export Unapproved Distributors excel file
exportUnapprovedDistributorsExcel(){
 let element = document.getElementById('unapprovedDistributorsTable');
 this.global.exportTableElmToExcel(element, 'Unapproved Distributors');
}

//export  Unapproved Vehicles excel file
exportUnapprovedPartsExcel(){
 let element = document.getElementById('unapprovedVehiclesTable');
 this.global.exportTableElmToExcel(element, 'Unapproved Vehicles');
}



//export Unapproved Distributors csv file
exportUnapprovedCompaniesCSV(){
 this.global.exportToCsv(this.listOfUnapprovedDistributorsToDisplay,
 'Unapproved Distributors', ['ID', 'cdCode', 'cdName', 'cdContactMobileNumber', 'cdContactFullName', 
 'cdEmail', 'regionCode', 'territoryCode', 'createdBy', 
 'createdOn', 'actions'
 ]);
}

//export Unapproved Vehicles csv file
exportUnapprovedPartsCSV(){
 this.global.exportToCsv(this.listOfUnapprovedVehiclesToDisplay,
 'Unapproved Vehicles', [
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
