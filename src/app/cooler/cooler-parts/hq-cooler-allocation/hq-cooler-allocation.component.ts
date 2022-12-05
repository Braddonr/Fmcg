import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hq-cooler-allocation',
  templateUrl: './hq-cooler-allocation.component.html',
  styleUrls: ['./hq-cooler-allocation.component.scss']
})
export class HqCoolerAllocationComponent implements OnInit {

  
   //define tool tip properties
   @Input() toolTipViewTitle: string = "View";
   @Input() toolTipViewColor: string = "blue";
   @Input() toolTipViewPosition = 'bottom';
 
   @Input() toolTipEditTitle: string = "Edit";
   @Input() toolTipEditColor: string = "";
   @Input() toolTipEditPosition = 'bottom';
 
   @Input() toolTipDeleteTitle: string = "Deallocate";
   @Input() toolTipDeleteColor: string = "red";
   @Input() toolTipDeletePosition = 'bottom';

   @Input() toolTipReallocateTitle: string = "Reallocate";
   @Input() toolTipReallocateColor: string = "orange";
   @Input() toolTipReallocatePosition = 'bottom';
 
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
  mandatoryColumns: any[] = ["UserName", "Full Name", "Email", "Status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  editData: boolean;
  cdCode: string ='';
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

  searchTerm = '';
  totalAllocated: any;
  totalUnAllocated: any;
  listOfDataToDisplay: any = [];
  listOfAllocationsToDisplay: any = [];
  listOfUnallocationsToDisplay: any = [];

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
  coolerAllocation: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private toastr : ToastrService,
    private modal: NzModalService,
    private global : GlobalService
  ) {}

  ngOnInit() {
    this.formAdd = this.formBuilder.group({
      assetNumber:new FormControl('', [<any>Validators.required]),
      coolerSize:new FormControl('', [<any>Validators.required]),
      model:new FormControl('', [<any>Validators.required]),
      serialNumber:new FormControl('', [<any>Validators.required]),
      status: new FormControl('', [<any>Validators.required]),
    });
    // this.loadProducts();
    this.loadAllocatedCoolers();
    this.loadUnallocatedCoolers();
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
//       this.loadProducts();
//     });
// }

// loadProducts(){
//   this.loading = true;
//  this.httpService.get("config/product/all", this.page, this.perPage).subscribe(res => {
//    if(res['status'] == 200 || res['status'] == 201){
//      this.loading = false;
//    this.listOfData = res['data']['content'];
//    this.total = res['totalCount'];
//    this.total = res['data']['totalPages'];

//    this.listOfDataToDisplay = [...this.listOfData];
    
//    this.listOfData.map((value, i) => {
//     let firstname = value.FirstName;
//     let middlename = value.MiddleName;
//     let lastname = value.LastName;
//     value.ID = (this.page - 1) * this.perPage + i+1;
//     return value.FullName = firstname + " " + middlename + " " + lastname;
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
      
//        case 'UserName':
//          this.columnsJson['UserName'] = 'UserName';
//          break;
//        case 'FullName': 
//          this.columnsJson['Full Name'] = 'FullName';
//          break;
//        case 'Email':
//          this.columnsJson['Email'] = 'Email';
//          break;
//       case 'Active':
//         this.columnsJson['Status'] = 'Active';
      
//        default: 
//        break;
//      }
//    });
//    this.displayColumns = Object.keys(this.columnsJson);
//    this.loading=false;
//  }
//  })
// }

loadAllocatedCoolers(){
  this.loading = true;
  this.httpService.getAllocations("cooler/allocations", this.cdCode, this.page, this.perPage).subscribe(res => {
    if(res['responseCode'] == 200){
    this.loading = false;
    this.listOfAllocations = res['data'];
    this.totalAllocated = res['totalCount'];
    this.total = res['data']['totalPages'];
    console.log(this.listOfAllocations);
    
 
    this.listOfAllocationsToDisplay = [...this.listOfAllocations];
    }
    this.loading = false;
  })
}

loadUnallocatedCoolers(){
  this.loading = true;
// // //use local server as endpoints are down
//  this.httpService.getMockData()
//  .subscribe(res => {
//   this.loading = false;
//   this.listOfUnallocations = res;

//   // console.log(this.listOfUnallocations);

//   this.listOfUnallocationsToDisplay = [...this.listOfUnallocations];
  
// });

  this.loading = true;
  this.httpService.getNoParams("cooler/unallocated-coolers").subscribe(res => {
    if(res['status'] = "Success"){
    this.loading = false;
    this.listOfUnallocations = res['data'];
    this.totalUnAllocated = res['totalCount'];
    this.total = res['data']['totalPages'];
    console.log(this.listOfUnallocations);
    
 
    this.listOfUnallocationsToDisplay = [...this.listOfUnallocations];
    }
  })
}
//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
 const {pageSize, pageIndex} = params;
 this.page = pageIndex;
 this.perPage = pageSize;
//  this.loadProducts();
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
    // return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    // return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    // return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
// return this.loadProducts();
 } else{
   this.listOfDisplayData = this.listOfData.filter((item) => {
     return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.FullName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.Email.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
     item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
 })
 }
}

// Delete Confirmation Dialog
delete(element): void {
  const snack = this.snackBar;

  this.loading = true;
  this.httpService.delete("cooler/delete", element.id)
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
      //   this.loadProducts();
      },
      error: () => {
        this.snackBar.open('Error deleting data', 'Eclectics International', {
          duration: 2000,
        });
        this.loading= false;
      }
    })
}
deallocate(element): void{
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/deallocate", id)
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
      this.loadAllocatedCoolers();
    })
}
reallocate(element): void{
  const id = {
    id: element.id
  }
  this.httpService.put("cooler/reallocate", id) 
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
      this.loadUnallocatedCoolers();
    })
}

view(element): void {
  this.router.navigate(['/distributors/view-distributor', element.id]);
}
// for allocated table
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
//for Unallocated table
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

  //open nzAddModal 
  showModalAdd(): void {
    this.isVisibleAdd = true;
    // this.loadProducts();
  }

  handleOkAdd(): void {
    this.addNewCooler();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    // this.loadProducts();
    this.coolerAllocation = element;
    this.formEdit = this.formBuilder.group(this.coolerAllocation);
    this.isVisibleEdit = true;
    console.log(this.coolerAllocation)
  }

  handleOkEdit(): void {
    this.editCooler();
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancelEdit(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }

  //open delete confirmation modal

  showDeAllocateConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Deallocate cooler',
      nzContent: '<p style="color: red;">Are you sure you want to deallocate this cooler?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deallocate(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  showReAllocateConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Reallocate cooler',
      nzContent: '<p style="color: red;">Are you sure you want to reallocate this cooler?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      // nzOkDanger: true,
      nzOnOk: () => this.reallocate(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  addNewCooler(){
    this.httpService.post("cooler/add", this.formAdd.value)
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

  editCooler(){
    const model = {
      assetNumber: this.formAdd.value.assetNumber,
      coolerSize: this.formAdd.value.coolerSize,
      model: this.formAdd.value.model,
      serialNumber: this.formAdd.value.serialNumber,
      status: this.formAdd.value.status,
      id: this.coolerAllocation['id'],
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
    
    this.httpService.put("cooler/edit-cooler", model).subscribe
    
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
      // this.loadProducts();
    })
  }

  
    //export Allocated Coolers PDF

    exportAllocatedCoolersPDF(){
      let element = 'table'
       let PDFTitle = 'Allocated Coolers';
       this.global.exportPDF(element, 'Allocated Coolers', PDFTitle);
    }

    //export UnAllocated Coolers PDF

    exportUnAllocatedCoolersPDF(){
      let element = 'table'
       let PDFTitle = 'Unallocated Coolers';
       this.global.exportPDF(element, 'Unallocated Coolers', PDFTitle);
    }

    //export Allocated Coolers excel file
    exportAllocatedCoolersExcel(){
      let element = document.getElementById('allocatedTable');
      this.global.exportTableElmToExcel(element, 'Allocated Coolers');
    }
  
     //export Unallocated Coolers excel file
     exportUnAllocatedCoolersExcel(){
      let element = document.getElementById('unallocatedTable');
      this.global.exportTableElmToExcel(element, 'Unallocated Coolers');
    }

    

    //export Allocated Coolers csv file
    exportAllocatedCoolersCSV(){
      this.global.exportToCsv(this.listOfAllocationsToDisplay,
      ' Allocated Coolers', ['id', 
      'coolerSize',
      'serialNumber',
      'assetNumber',
      'status', 
      'createdBy',
      'createdOn',
      'remarks'
      ]);
    }

    //export Unallocated Coolers csv file
    exportUnAllocatedCoolersCSV(){
      this.global.exportToCsv(this.listOfUnallocationsToDisplay,
      'Unallocated Coolers', ['id', 
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
