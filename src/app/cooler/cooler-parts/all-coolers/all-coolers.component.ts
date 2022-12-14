import { AddCoolerComponent } from './../add-cooler/add-cooler.component';
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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-all-coolers',
  templateUrl: './all-coolers.component.html',
  styleUrls: ['./all-coolers.component.scss']
})
export class AllCoolersComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','Model','Asset_Number','Cooler_Size','Serial_Number','Purchase_Date','Created_By','Created_On','Reworked_By','Status','Remarks','Actions'];
  
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
   
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  column = this.formBuilder.group({
    model: true,
    assetNumber: true,
    coolerSize: true,
    serialNumber: true,
    purchaseDate:true,
    createdBy: true,
    remarks: true,
    createdOn: true,
    status: true,
    actions: true,
  })
  mandatoryColumns: any[] = [
    "model",
    "status",
    "serialNumber",
    "purchaseDate",
    "createdBy",
    "remarks",
    "coolerSize",
    "assetNumber"

  ];
  checkList: any[] = [
    { name: 'ID', status: false },
    { name: 'Cooler Model', status: true },
    { name: 'Cooler Size', status: true },
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
  updateCooler: boolean;
  coolerDetails:any;
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

  showHideModel: boolean = false;
  showHideAssetNumber: boolean = false;
  showHideCoolerSize: boolean = false;
  showHideSerialNumber: boolean = false;
  showHidePurchaseDate: boolean = false;
  showHideCreatedBy: boolean = false;
  showHideStatus: boolean = false;
  showHideRemarks: boolean = false;
  showHideCreatedOn: boolean = false;
  showHideAction: boolean = false;

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
  cooler: any;
  models: any[] = [];

    model: string;
    assetNumber: string;
    coolerSize: string;
    serialNumber: string;
    purchaseDate:string;
    createdBy: string;
    remarks: string;
    createdOn: string;
    status: string;
    actions: string;

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
  ) { }

  ngOnInit() {
    this.formAdd = this.formBuilder.group({
      assetNumber:new FormControl('', [<any>Validators.required]),
      coolerSize:new FormControl('', [<any>Validators.required]),
      model:new FormControl('', [<any>Validators.required]),
      serialNumber:new FormControl('', [<any>Validators.required]),
      status: new FormControl('', [<any>Validators.required]),
    }); 
    this.loadCoolerSpareParts();
  }

  //opens creation modal
  triggerModal(data: any): void {
    this.updateCooler = false;
    this.coolerDetails = data;
    const dialogRef = this.dialog.open(AddCoolerComponent, {data: {data: this.coolerDetails, updateCooler: this.updateCooler}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadCoolerSpareParts();
    })
  }

   //open cooler update modal
   edit(data: any): void {
    this.coolerDetails = data;
    this.updateCooler = true;
    const dialogRef = this.dialog.open(AddCoolerComponent, {data: {data: this.coolerDetails, updateCooler: this.updateCooler}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadCoolerSpareParts();
    })
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
    this.router.navigate(['/distributors/view-distributor', element.id]);
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

  loadCoolerSpareParts() {
    this.loading = true;
    this.httpService.get("cooler/all", this.page, this.perPage).subscribe(res => {
      if (res['responseCode'] == 200 || res['responseCode'] == 0) {
        this.loading = false;
        this.listOfData = res['data'];
        this.totalCoolers = res['totalCount'];
        console.log('All-Coolers');
        console.log(this.listOfData);
        
        this.listOfData.map((x: any) => {
          if(!this.models.includes(x.model)){
          this.models.push(x.model)
         }
        })
        console.log(this.models);
        
        

        this.listOfDataToDisplay = [...this.listOfData];


        // @ts-ignore
        this.dataSource= new MatTableDataSource(this.listOfData);
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.total = res['totalCount'];

        this.listOfData.map((value, i) => {
          value.ID = (this.page) * this.perPage + i + 1;
        })

        this.listOfDisplayData = [...this.listOfData];
        let columns = [];
        this.listOfData.map(item => {
          Object.keys(item).map(itemKeys => {
            columns.push(itemKeys);
          })
        });
        this.columnsToExport = Array.from(new Set(columns));
        this.columnsToExport.map(item => {
          switch (item) {

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
        this.loading = false;
      }
    })
  }

  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadCoolerSpareParts();
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

  statusSearch() {
    // this.visible = false;
    console.log(this.searchStatus)
    if (this.searchStatus == false) {
      this.allStatus = false;
    }
    this.listOfDisplayData = this.listOfData.filter(item =>
      item.Active == this.searchStatus);
  }
  removeStatusFilter() {
    // this.visible = false;
    this.listOfDisplayData = this.listOfData

  }

  userNameSearch() {
    if (this.searchValue.length < 1) {
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
      );
    }
  }
  emailSearch() {
    if (this.searchEmail.length < 1) {
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
      );
    }
  }
  fullnameSearch() {
    if (this.searchfullName.length < 1) {
      return this.loadCoolerSpareParts();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
      );
    }
  }

  globalSearch() {
    if (this.searchInput.length < 1) {
      return this.loadCoolerSpareParts();
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
        { def: 'Model', label: 'Model', },
        { def: 'Asset_Number', label: 'Asset Number', },
        { def: 'Cooler_Size', label: 'Cooler Size', },
        { def: 'Serial_Number', label: 'Serial Number', },
        { def: 'Purchase_Date', label: 'Purchase Date', },
        { def: 'Created_By', label: 'Created By', },
        { def: 'Created_On', label: 'Created On', },
        { def: 'Reworked_By', label: 'Reworked By', },
        { def: 'Status', label: 'Status',},
        { def: 'Remarks', label: 'Remarks',},
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
          this.loadCoolerSpareParts();
          this.cooler = element;
          this.formEdit = this.formBuilder.group(this.cooler);
          this.isVisibleEdit = true;
          console.log(this.cooler)
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
      
        showDeleteConfirm(element): void {
          this.modal.confirm({
            nzTitle: 'Delete cooler',
            nzContent: '<p style="color: red;">Are you sure you want to delete this cooler?</p>',
            nzOkText: 'Yes',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.delete(element),
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
            id: this.cooler['id'],
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
          
          this.httpService.put("cooler/edit-cooler", model)
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
            this.loadCoolerSpareParts();
          })
        }
      
        
          //export PDF file
      
          exportCoolersPDF(){
            let element = 'table'
             let PDFTitle = 'Coolers';
             this.global.exportPDF(element, 'Coolers', PDFTitle);
      
          }
          //export excel file
          exportCoolersExcel(){
            let element = document.getElementById('coolersTable');
            this.global.exportTableElmToExcel(element, 'Coolers');
          }
      
          //export csv file
          exportCoolersCSV(){
            this.global.exportToCsv(this.listOfDataToDisplay,
            'Coolers', ['id', 
            'model',
            'serialNumber',
            'assetNumber',
            'status', 
            'createdBy',
            'createdOn',
            ]);
          }

}
