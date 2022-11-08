import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-pending-add',
  templateUrl: './pending-add.component.html',
  styleUrls: ['./pending-add.component.scss']
})
export class PendingAddComponent implements OnInit {

  columns = this._formBuilder.group({
    id: false,
    outletName: false,
    outletCode: false,
    creditName: true,
    type:true,
    outletRoute: true,
    location: true,
    contactName: true,
    contactPhone: true,
    latitude: false,
    longitude: false,
    createdBy: true,
    createdOn: true,
    actions: true,
  });
   
  
  data_loaded: boolean = false;
  loading: boolean = false;
  page: number = 0;
  perPage: number = 10;
  total: number = 1;
  status: boolean = false;
  pendingAddData: any = [];

  showHideDetails: boolean = true;
  showHideID: boolean = true;
  showHideCode: boolean = true;
  showHideCdCode: boolean = true;
  showHideLatitude: boolean = true;
  showHideLongitude: boolean = true;
  showHideRemarks: boolean = true;
  showHideOutletName: boolean = true;
  showHideCreditName: boolean = false;
  showHideType: boolean = false;
  showHideOutletRoute: boolean = false;
  showHideLocation : boolean = false;
  showHideContactName : boolean = false;
  showHideContactPhone : boolean = false;
  showHideCreatedBy: boolean = false;
  showHideCreatedOn: boolean = false;
  showHideActions: boolean = false;

  searchTerm ='';
  pendingTotalNumber: any;


  constructor(
    private httpService: HttpService,
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    // public dialogRef: MatDialogRef<PendingAddComponent>
      ) {}

  ngOnInit(): void {
   this.loadPendingAdd();  
  }

  loadPendingAdd(){
    this.loading = true;
    this.httpService.getPending("outlet/all",  this.page, this.perPage, this.status).subscribe(res => {
      if(res['responseCode'] == 200 || res['responseCode'] == 0){
        this.loading = false;
      this.pendingAddData = res['data'];
      this.pendingTotalNumber = res['totalCount'];
      console.log(this.pendingTotalNumber);
      
    }
    console.log(this.pendingAddData);
     });
   }

  approvePendingAdd(element): void{
    console.log(element)
    this.httpService.put("outlet/approve", element).subscribe(res => {
    console.log(res);
    if (res['status'] === "Success") {
      if(res["message"] = "Approved cooler successfully!") {
        this.toastr.success("Outlet has been approved", "Success!");
        
      } 
      else {
        this.toastr.success("Outlet has been approved,", "Success!");
       
      }      
    } 
    else {
      this.toastr.error("Outlet was not approved", "Error!");
    }
    this.loadPendingAdd();
    })
   }

   onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadPendingAdd();
   }
   
   show_hide_ID() {
    this.showHideID = !this.showHideID;
    }
  show_hide_code() {
      this.showHideCode = !this.showHideCode;
    }
  show_hide_latitude() {
      this.showHideLatitude = !this.showHideLatitude;
    }
  show_hide_longitude() {
      this.showHideLongitude = !this.showHideLongitude;
    }
  show_hide_remarks() {
      this.showHideRemarks = !this.showHideRemarks;
    }
  show_hide_outletname() {
      this.showHideOutletName = !this.showHideOutletName;
    } 
  show_hide_creditname(){
      this.showHideCreditName = !this.showHideCreditName;
    }
  show_hide_type(){
      this.showHideType = !this.showHideType;
    }
  show_hide_outletroute(){
      this.showHideOutletRoute = !this.showHideOutletRoute ;
    }
  show_hide_location(){
      this.showHideLocation = !this.showHideLocation;
    }
  show_hide_cdCode(){
      this.showHideCdCode = !this.showHideCdCode;
    }
  show_hide_contactname(){
      this.showHideContactName = !this.showHideContactName ;
    }
  show_hide_contactphone(){
      this.showHideContactPhone = !this.showHideContactPhone ;
    }
  show_hide_createdby(){
      this.showHideCreatedBy = !this.showHideCreatedBy ;
    }
  show_hide_createdon(){
      this.showHideCreatedOn = !this.showHideCreatedOn;
    }
  show_hide_actions(){
      this.showHideActions = !this.showHideActions;
    }





 }
