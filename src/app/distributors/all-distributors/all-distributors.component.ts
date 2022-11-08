import { AddDistributerComponent } from './../add-distributer/add-distributer.component';
import { AfterViewInit, Component, Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, merge, throwError } from 'rxjs';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { endOfMonth } from 'date-fns';
import { Toast, ToastrService } from 'ngx-toastr';
import { NzModalService } from 'ng-zorro-antd/modal';
import { GlobalService } from 'src/app/shared/services/global.service';

// @Directive({ 
//   selector: '[showColumn]' 
// })

@Component({
  selector: 'app-all-distributors',
  templateUrl: './all-distributors.component.html',
  styleUrls: ['./all-distributors.component.scss']
})


export class AllDistributorsComponent implements OnInit {
  @Input() showInput: string;

  //define tool tip properties
  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';

  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';

  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  public addDistributerForm: FormGroup;
  displayedColumns: string[] = ['Position','ID','CD_Code','CD_Name','Contact_Name','Phone_Number','Region','Territory','Email_Address','Created_On','Actions'];
  
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  someMethod() {
    this.trigger.openMenu();
  }

  column = this.formBuilder.group({
    ID: true,
    cdCode: true,
    cdName: true,
    cdContactMobileNumber: true,
    cdContactFullName: true,
    cdEmail: true,
    regionCode: true,
    territoryCode: true,
    remarks: false,
    createdOn: true,
    actions: true,
    createdBy: false,
  });

  mandatoryColumns: any[] = [
  "Position",
  "CD_Code",
  "CD_Name",
  "Contact_Name",
  "Phone_Number",
  "Region",
  "Territory",
  "Email_Address",
  "Created_On"
  ];

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
  
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateDistributor: boolean;
  distributerDetails: any;
  page: number = 1;
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
  showHideID: boolean = false;
  showHideCode: boolean = false;
  showHideName: boolean = false;
  showHideContactName: boolean = false;
  showHideMobileNumber: boolean = false;
  showHideRegion: boolean = false;
  showHideTerritory: boolean = false;
  showHideEmail: boolean = false;
  showHideCreatedOn: boolean = false;
  showHideAction: boolean = false;
  

  showHideRemarks: boolean = true;
  showHideCreatedBy: boolean = true;
  showAll = false;

  searchTerm = '';
  totalDistributors: any;
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

  ID: string;
  cdCode: string;
  cdName: string;
  cdContactFullName: string;
  cdContactMobileNumber: string;
  regionCode: string;
  territoryCode: string;
  cdEmail: string;
  
  distributor: any;

  public popoverTitle: string = 'Popover Title';
  public popoverMessage: string = 'Popover description'
  public confirmClicked: boolean = false;
  public cancelClicked: boolean = false;



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
  ) {
    this.dataSource = new MatTableDataSource(this.listOfData);
  }
  

  ngOnInit() {
    // Add DistributorForm 
    this.formAdd = this.formBuilder.group({
      cdName:new FormControl('', [<any>Validators.required]),
      cdCode:new FormControl('', [<any>Validators.required]),
      cdContactFullName:new FormControl('', [<any>Validators.required]),
      cdContactMobileNumber:new FormControl('', [<any>Validators.required]),
      cdEmail: new FormControl('', [<any>Validators.required]),
      regionCode:new FormControl('', [<any>Validators.required]),
      territoryCode:new FormControl('', [<any>Validators.required]),
      remarks:new FormControl('', [<any>Validators.required]),
    }); 
    this.loadDistributors();
  }

  

  //opens distributer creation modal
  triggerModal(data: any): void {
    this.updateDistributor = false;
    this.distributerDetails = data;
    const dialogRef = this.dialog.open(AddDistributerComponent, {data: {data: this.distributerDetails, updateDistributor: this.updateDistributor}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadDistributors();
    })
  }

   //open distributor update modal
  //  edit(data: any): void {
  //   this.distributerDetails = data;
  //   this.updateDistributor = true;
  //   const dialogRef = this.dialog.open(AddDistributerComponent, {data: {data: this.distributerDetails, updateDistributor: this.updateDistributor}, height: '570px', width: '570px', disableClose: true});
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.loadDistributors();
  //   })
  // }


  delete(element): void {
    
    const snack = this.snackBar;

    this.loading = true;
    this.httpService.delete("distributor/delete-distributor", element.id)
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
          this.loadDistributors();
        },
        error: () => {
          this.snackBar.open('Error deleting data', 'Eclectics International', {
            duration: 2000,
          });
          this.loading= false;
        }
      })
  }

  // delete() {
  //   const dialogRef = this.dialog.open(DialogComponent,{
  //     data:{
  //       message: 'Are you sure want to delete?',
  //       buttonText: {
  //         ok: 'Yes',
  //         cancel: 'No'
  //       }
  //     }
  //   });
  //   const snack = this.snackBar;

  //   dialogRef.afterClosed().subscribe((confirmed: boolean) => {
  //     if (confirmed) {
  //       console.log("Implement delete functionality here");
  //       snack.dismiss();
  //       const a = document.createElement('a');
  //       a.click();
  //       a.remove();
  //       snack.dismiss();
  //       this.snackBar.open('Data deleted successfully', 'Eclectics International', {
  //         duration: 2000,
  //       });
  //     }
  //   });
  // }

 //navigates to single user view
 view(element): void {
  this.router.navigate(['/distributors/view-distributor', element.id]);
}


loadDistributors(){
  this.loading = true;
 this.httpService.get("distributor/all", this.page, this.perPage).subscribe(res => {
   if(res['responseCode'] == 200 || res['responseCode'] == 201){
     this.loading = false;
   this.listOfData = res['data'];
   console.log('this.listOfData');
   this.totalDistributors = res['totalCount'];
   console.log(this.listOfData);

   this.listOfDataToDisplay = [...this.listOfData];


   // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort
   this.total = res['totalCount'];

   this.listOfData.map((value, i) => {
    value.ID = (this.page) * this.perPage + i+1;
  });

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
 this.loadDistributors();
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
removeStatusFilter(){
  // this.visible = false;
  this.listOfDisplayData = this.listOfData

}

userNameSearch(){
  if(this.searchValue.length < 1){
    return this.loadDistributors();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
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


form:FormGroup = new FormGroup({
  Position: new FormControl(false),
  CD_Code: new FormControl(false),
  CD_Name: new FormControl(false),
  Contact_Name: new FormControl(false),
  Phone_Number: new FormControl(false),
  Region: new FormControl(false),
  Territory: new FormControl(false),
  Email_Address: new FormControl(false),
  Created_On: new FormControl(false),
});

Position = this.form.get('ID');
CD_Code = this.form.get('cdCode');
CD_Name = this.form.get('cdName');
Contact_Name = this.form.get('cdContactFullName');
Phone_Number = this.form.get('cdContactMobileNumber');
Region = this.form.get('regionCode');
Territory = this.form.get('territoryCode');
Email_Address = this.form.get('cdEmail');
Created_On = this.form.get('cdEmail');

cbValues;

columns: string[];
/**
 * Control column ordering and which columns are displayed.
 */

columnDefinitions = [
  { def: 'Position', label: 'Position', },
  { def: 'ID', label: 'ID', },
  { def: 'CD_Code', label: 'CD Code', },
  { def: 'CD_Name', label: 'CD Name', },
  { def: 'Contact_Name', label: 'Contact Name', },
  { def: 'Phone_Number', label: 'Phone Number', },
  { def: 'Region', label: 'Region', },
  { def: 'Territory', label: 'Territory',},
  { def: 'Email_Address', label: 'Email Address',},
  { def: 'Created_On', label: 'Created On',},
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
    this.loadDistributors();
  }

  handleOkAdd(): void {
    this.addNewDistributor();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  
  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadDistributors();
    this.distributor = element;
    this.formEdit = this.formBuilder.group(this.distributor);
    this.isVisibleEdit = true;
    console.log(this.distributor)
  }

  handleOkEdit(): void {
    this.editDistributor();
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
      nzContent: '<p style="color: red;">Are you sure you want to delete this outlet?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  
  // exportDistributorsPDF() {
  //   var prepare=[];
  //   this.listOfData.forEach(e=>{
  //     var tempObj =[];
  //     tempObj.push(e.cdCode);
  //     tempObj.push(e.cdName);
  //     tempObj.push(e.cdContactFullName);
  //     tempObj.push( e.cdContactMobileNumber);
  //     tempObj.push(e.regionCode);
  //     tempObj.push(e.territoryCode);
  //     tempObj.push(e.cdEmail);
  //     tempObj.push(e.createdOn);
  //     prepare.push(tempObj);
  //   });
  //   const doc = new jsPDF('l', 'mm', 'a4',);
  //   var fontSize = 12; 
  //   var imageUrl = "./assets/images/iko-stock-logo.png";
  //   doc.setFontSize(fontSize);
  //   doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
  //   doc.text("DISTRIBUTORS LIST",  123, 48,);
  //   autoTable(doc, {
  //       head: [['CD CODE','CD NAME','CONTACT NAME','CONTACT NUMBER','REGION','TERRITORY','EMAIL','CREATED ON']],
  //       margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
  //       body: prepare,
  //       startY: 65,
  //       theme: 'striped',
  //       headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
  //       foot: [['','', '','@Eclectics International',' ','','',]],
  //       footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
  //       bodyStyles: {minCellHeight: 10, fontSize: 9.5}
  //   });

  //   doc.save('Distributors_List' + '.pdf');
  // }

  addNewDistributor(){
    this.httpService.post("distributor/add", this.formAdd.value)
    .subscribe({
     next:(res)=> { 
      let message: any;
      message = res['message']
       this.toastr.success(message, "Success!");
       this.form.reset();
     },
     error:(err)=>{
      let errorMessage: any;
      errorMessage = err.error['message']

       this.toastr.error(errorMessage, "Error!");
     },
    })
  }

  editDistributor(){
    const model = {
      cdName: this.form.value.cdName,
      cdCode: this.form.value.cdCode,
      cdContactFullName: this.form.value.cdContactFullName,
      cdEmail: this.form.value.cdEmail,
      regionCode: this.form.value.regionCode,
      territoryCode: this.form.value.territoryCode,
      remarks: this.form.value.remarks,
      id: this.distributor['id'],
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
    
    this.httpService.put("distributor/edit-distributor", model).subscribe
    
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
      this.loadDistributors();
    })
  }

  
    //export PDF file

    exportDistributorsPDF(){
      let element = 'table'
       let PDFTitle = 'Distributors List';
       this.global.exportPDF(element, 'Distributors', PDFTitle);

    }
    //export excel file
    exportDistributorsExcel(){
      let element = document.getElementById('distributorsTable');
      this.global.exportTableElmToExcel(element, 'Distributors');
    }

    //export csv file
    exportDistributorsCSV(){
      this.global.exportToCsv(this.listOfDataToDisplay,
      'Distributors', ['ID', 'cdCode', 'cdName', 'cdContactMobileNumber', 'cdContactFullName', 
      'cdEmail', 'regionCode', 'territoryCode', 'createdBy', 
      'createdOn', 'actions']);
    }
   }
