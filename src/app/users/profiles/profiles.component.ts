import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { endOfMonth } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {

  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';
  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';
  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  checkList: any[] = [
    { name: 'ID', status: true },
    { name: 'Profile Name', status: true },
    { name: 'Enabled', status: true },
    { name: 'Deleted', status: true },
    { name: 'Reworked', status: true },
    { name: 'Approved', status: true },
    { name: 'Approved By', status: true },
    { name: 'Created By', status: true },
    { name: 'Remarks', status: true },
    { name: 'Actions', status: true },
  ]
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
  profile: any;
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
      companyName:new FormControl('', [<any>Validators.required]),
      contactName:new FormControl('', [<any>Validators.required]),
      contactPhone:new FormControl('', [<any>Validators.required]),
      email:new FormControl('', [<any>Validators.required]),
      location: new FormControl('', [<any>Validators.required]),
      remarks: new FormControl('', [<any>Validators.required]),
    }); 
    this.loadProfiles();
  }

  // Delete Confirmation Dialog
  delete(element): void {
    const snack = this.snackBar;

    this.loading = true;
    this.httpService.delete("profile/delete", element.id)
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
          this.loadProfiles();
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
    this.router.navigate(['/user-management/profiles', element.id]);
  }

  loadProfiles(){
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
  
   this.httpService.get("profile/all", this.page, this.perPage).subscribe(res => {
     if(res['responseCode'] == 200 || res['responseCode'] == 201){
       this.loading = false;
     this.listOfData = res['data'];
     this.total = res['totalCount']
     console.log('Cooler-Companies');
     console.log(this.listOfData);
  
     this.listOfDataToDisplay = [...this.listOfData];
     }
   })
  }
  
  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
   const {pageSize, pageIndex} = params;
   this.page = pageIndex;
   this.perPage = pageSize;
   this.loadProfiles();
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
  
    //open nzAddModal 
    showModalAdd(): void {
      this.isVisibleAdd = true;
      this.loadProfiles();
    }
  
    handleOkAdd(): void {
      this.addNewProfile();
      console.log('Button ok clicked!');
      this.isVisibleAdd = false;
    }
  
    handleCancelAdd(): void {
      console.log('Button cancel clicked!');
      this.isVisibleAdd = false;
    }
  
    
    //       //open nzEditModal 
    showModalEdit(element): void {
      this.loadProfiles();
      this.profile = element;
      console.log(this.profile)
      this.formEdit = this.formBuilder.group(this.profile);
      this.isVisibleEdit = true;
      
    }
  
    handleOkEdit(): void {
      this.editProfile();
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
        nzTitle: 'Delete profile',
        nzContent: '<p style="color: red;">Are you sure you want to delete this profile?</p>',
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.delete(element),
        nzCancelText: 'No',
        nzOnCancel: () => console.log('Cancel')
      });
    }
  
   addNewProfile(){
    this.httpService.post("profile/add", this.formAdd.value)
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
   editProfile(){
    const model = {
      companyName: this.formEdit.value.companyName,
      contactName: this.formEdit.value.contactName,
      contactPhone: this.formEdit.value.contactPhone,
      email: this.formEdit.value.email,
      location: this.formEdit.value.location,
      remarks: this.formEdit.value.remarks,
      id: this.profile['id'],
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
    
    this.httpService.put("profile/edit", model)
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
        this.loadProfiles();
    })
  
   }
  
    // Download PDF
    exportProfilesPDF() {
      let element = 'table'
      let PDFTitle = 'Existing Profiles';
     this.global.exportPDF(element, 'Existing Profiles', PDFTitle);
  }
  
  //export excel file
   exportProfilesExcel(){
    let element = document.getElementById('profilesTable');
    this.global.exportTableElmToExcel(element, 'Existing Profiles');
   }
   
   //export csv file
   exportProfilesCSV(){
    this.global.exportToCsv(this.listOfDataToDisplay,
      'Existing Profiles', ['id', 
      'profileName',
      'enabled', 
      'deleted', 
      'reworked', 
      'approved', 
      'approvedBy',
      'createdBy',
      'remarks',
      ]);
   }
}
