import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {

 
   //define tool tip properties
   @Input() toolTipViewTitle: string = "View";
   @Input() toolTipViewColor: string = "blue";
   @Input() toolTipViewPosition = 'bottom';
 
   @Input() toolTipEditTitle: string = "Approve";
   @Input() toolTipEditColor: string = "green";
   @Input() toolTipEditPosition = 'bottom';
 
  //  @Input() toolTipDeleteTitle: string = "Deallocate";
  //  @Input() toolTipDeleteColor: string = "red";
  //  @Input() toolTipDeletePosition = 'bottom';

  //  @Input() toolTipReallocateTitle: string = "Reallocate";
  //  @Input() toolTipReallocateColor: string = "red";
  //  @Input() toolTipReallocatePosition = 'bottom';
 
   checkList: any[] = [
    { name: 'ID', status: false },
    // { name: 'Cooler Model', status: true },
    { name: 'Cooler Size', status: true },
    { name: 'Serial Number', status: true },
    { name: 'Asset Number', status: true },
    { name: 'Status', status: true },
    { name: 'Created By', status: true },
    { name: 'Created On', status: true },
    { name: 'Remarks', status: true },
    { name: 'Actions', status: true },
  ]
  checkList2: any[] = [
    { name: 'ID', status: false },
    // { name: 'Cooler Model', status: true },
    { name: 'Cooler Size', status: true },
    { name: 'Serial Number', status: true },
    { name: 'Asset Number', status: true },
    { name: 'Status', status: true },
    { name: 'Created By', status: true },
    { name: 'Created On', status: true },
    { name: 'Remarks', status: true },
    { name: 'Actions', status: true },
  ]
  checkList3: any[] = [
    { name: 'ID', status: false },
    // { name: 'Cooler Model', status: true },
    { name: 'Cooler Size', status: true },
    { name: 'Serial Number', status: true },
    { name: 'Asset Number', status: true },
    { name: 'Status', status: true },
    { name: 'Created By', status: true },
    { name: 'Created On', status: true },
    { name: 'Remarks', status: true },
    { name: 'Actions', status: true },
  ]

  page: number = 0;
  perPage: number = 10;
  total: number;
  searchValue: string = '';
  visible: boolean = false;
  listOfPendingCoolers: any[] = [];
  listOfPendingAllocations: any[] = [];
  listOfPendingDeAllocations: any[] = [];
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
  showAll3 = false;

  searchTerm = '';
  totalAllocated: any;
  listOfDataToDisplay: any = [];
  listOfAllocationsToDisplay: any = [];
  listOfPendingCoolersToDisplay: any = [];
  listOfPendingAllocationsToDisplay: any = [];
  listOfPendingDeAllocationsToDisplay: any = [];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private toastr : ToastrService,
    private modal: NzModalService,
    private global : GlobalService
  ) {}

  ngOnInit(): void {
    this.loadPendingAllocate();
    this.loadPendingApprovalCoolers();
    this.loadPendingDeallocate();
  }

  loadPendingApprovalCoolers(){
  this.loading = true;
  //endpoints not yet ready so use local server
  this.httpService.getMockData()
 .subscribe(res => {
  
  this.loading = false;
  this.listOfPendingCoolers = res

  // console.log(this.listOfPendingCoolers);

  this.listOfPendingCoolersToDisplay = [...this.listOfPendingCoolers];
});

  }
  loadPendingAllocate(){
  this.loading = true;
  //endpoints not yet ready so use local server
  this.httpService.getMockData()
 .subscribe(res => {
  
  this.loading = false;
  this.listOfPendingAllocations = res

  // console.log(this.listOfUnallocations);

  this.listOfPendingAllocationsToDisplay = [...this.listOfPendingAllocations];
});

   }
  loadPendingDeallocate(){
    this.loading = true;
    //endpoints not yet ready so use local server
    this.httpService.getMockData()
 .subscribe(res => {
  
  this.loading = false;
  this. listOfPendingDeAllocations = res

  // console.log(this.listOfUnallocations);

  this.listOfPendingDeAllocationsToDisplay = [...this.listOfPendingDeAllocations];
});
  }

  //updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
  const {pageSize, pageIndex} = params;
  this.page = pageIndex;
  this.perPage = pageSize;
  this.loadPendingAllocate();
  this.loadPendingApprovalCoolers();
  this.loadPendingDeallocate();
 }

  // for coolers pending approval table
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
//for allocated coolers pending approval table
show_hide_all2() {
  this.checkList2.forEach(item => {
      item.status = this.showAll
  });
}
 showHideColumn2(name: string): boolean {
  let temp = this.checkList2.filter(item => item.name == name);
  return temp[0].status
}

toggleStatus2(name: string) {
  this.checkList2.forEach(item => {
    if (item.name == name) {
      item.status = !item.status
    }
      this.showAll2 = false;
  });
}
//for deallocated coolers pending approval table
show_hide_all3() {
  this.checkList3.forEach(item => {
      item.status = this.showAll
  });
}
 showHideColumn3(name: string): boolean {
  let temp = this.checkList3.filter(item => item.name == name);
  return temp[0].status
}

toggleStatus3(name: string) {
  this.checkList3.forEach(item => {
    if (item.name == name) {
      item.status = !item.status
    }
      this.showAll3 = false;
  });
}

approveCooler(element): void{
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/approve", id)
  .subscribe({
    next:(res)=> { 
     let message: any;
     message = res['message']
      this.toastr.success(message, "Success!");
      this.loadPendingApprovalCoolers();
    },
    error:(err)=>{
     let errorMessage: any;
     errorMessage = err.error['message']
      this.toastr.error(errorMessage, "Error!");
    },
   })
}
approveAllocatedCooler(element): void{
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/approve-allocate", id)
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
      this.loadPendingAllocate();
    })
}
approveDeallocatedCooler(element): void{
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/approve-deallocate", id)
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
      this.loadPendingDeallocate();
    })
}


    //export CoolersPendingApproval PDF

    exportCoolersPendingApprovalPDF(){
      let element = 'table'
       let PDFTitle = 'Coolers Pending Approval';
       this.global.exportPDF(element, 'Coolers Pending Approval', PDFTitle);
    }

    //export Pending Allocated Coolers PDF

    exportPendingAllocatedCoolersPDF(){
      let element = 'table'
       let PDFTitle = 'Pending Allocated Coolers';
       this.global.exportPDF(element, 'Pending Allocated Coolers', PDFTitle);
    }

     //export Pending DeAllocated Coolers PDF

     exportPendingDeAllocatedCoolersPDF(){
      let element = 'table'
       let PDFTitle = 'Pending DeAllocated Coolers';
       this.global.exportPDF(element, 'Pending DeAllocated Coolers', PDFTitle);
    }

    //export CoolersPendingApproval excel file
    exportCoolersPendingApprovalExcel(){
      let element = document.getElementById('pendingCoolersTable');
      this.global.exportTableElmToExcel(element, 'Coolers Pending Approval');
    }
  
     //export PendingAllocated excel file
     exportPendingAllocatedExcel(){
      let element = document.getElementById('pendingAllocatedTable');
      this.global.exportTableElmToExcel(element, 'Pending Allocated Coolers');
    }

     //export PendingDeAllocated excel file
     exportPendingDeAllocatedExcel(){
      let element = document.getElementById('pendingDeAllocateTable');
      this.global.exportTableElmToExcel(element, 'Pending DeAllocated  Coolers');
    }

    
    //export CoolersPendingApproval csv file
    exportCoolersPendingApprovalCSV(){
      this.global.exportToCsv(this.listOfPendingCoolersToDisplay,
      'Coolers Pending Approval', ['id', 
      'coolerSize',
      'serialNumber',
      'assetNumber',
      'status', 
      'createdBy',
      'createdOn',
      'remarks'
      ]);
    }
    //export PendingAllocated Coolers csv file
    exportPendingAllocatedCSV(){
      this.global.exportToCsv(this.listOfPendingAllocationsToDisplay,
      'Pending Allocated Coolers', ['id', 
      'coolerSize',
      'serialNumber',
      'assetNumber',
      'status', 
      'createdBy',
      'createdOn',
      'remarks'
      ]);
    }

    //export PendingDeAllocated Coolers csv file
    exportPendingDeAllocatedCSV(){
      this.global.exportToCsv(this.listOfPendingDeAllocationsToDisplay,
      'Pending DeAllocated Coolers', ['id', 
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
