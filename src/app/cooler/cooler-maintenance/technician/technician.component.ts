import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss']
})
export class TechnicianComponent implements OnInit {

  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';
  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';
  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  mandatoryColumns: any[] = ["UserName", "Full Name", "Email", "Status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  editData: boolean;
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

  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Username', status: true },
    { name: 'Full Name', status: true },
    { name: 'Email', status: true },
    { name: 'Status', status: true },
    { name: 'Actions', status: true },
  ]


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
  technician: any;

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
    this.loadProducts();
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

loadProducts(){
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

//   this.httpService.get("cooler/maintenance/techs", this.page, this.perPage).subscribe(res => {
//    if(res['status'] == 200 || res['status'] == 201){
//      this.loading = false;
//    this.listOfData = res['data']['content'];
//    console.log('Products');
//    console.log(this.listOfData)
//    this.total = res['data']['totalPages'];

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

    // Download PDF
    exportCoolerTechniciansPDF() {
      let element = 'table'
      let PDFTitle = 'Cooler Technicians';
     this.global.exportPDF(element, 'Cooler Technicians', PDFTitle);
  }
  
  //export excel file
   exportCoolerTechniciansExcel(){
    let element = document.getElementById('coolerTechniciansTable');
    this.global.exportTableElmToExcel(element, 'Cooler Technicians');
   }
   //export csv file
   exportCoolerTechniciansCSV(){
    this.global.exportToCsv(this.listOfDataToDisplay,
      'Cooler Technicians', ['id', 
      'model',
      'serialNumber',
      'assetNumber',
      'status', 
      'createdBy',
      'createdOn',
      ]);
   }

}
