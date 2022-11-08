import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss']
})
export class AddOutletComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  outlet:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;
  routes: any;
  routeNames = [];
  routeIds = [];
  selectedValue: any;
  loadedRoute: any;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddOutletComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private modal: NzModalService
    
  ) { }

  ngOnInit(): void {
   
    this.editBool = this.data['updateOutlet'];
    this.editData = this.data['updateOutlet'];
    this.cardTitle = this.editData ? "Update Outlet Details": "Add New Outlet";
    this.outlet = this.data['data'];

    console.log(this.outlet)
    this.loadedRoute = this.outlet.outletRoute;
   

    // if(this.create){
    this.form = this.fb.group({ 
      outletName:[this.outlet ? this.outlet['outletName']: '', Validators.compose([Validators.required])],
      outletCode:[this.outlet ? this.outlet['outletCode']: '', Validators.compose([Validators.required])],
      outletType:[this.outlet ? this.outlet['outletType']: '', Validators.compose([Validators.required])],
      outletRoute:[this.outlet ? this.outlet['outletRoute']: '', Validators.compose([Validators.required])],
      location:[this.outlet ? this.outlet['location']: '', Validators.compose([Validators.required])],
      latitude:[this.outlet ? this.outlet['latitude']: '', Validators.compose([Validators.required])],
      longitude:[this.outlet ? this.outlet['longitude']: '', Validators.compose([Validators.required])],
      cdName:[this.outlet ? this.outlet['cdName']: '', Validators.compose([Validators.required])],
      cdCode:[this.outlet ? this.outlet['cdCode']: '', Validators.compose([Validators.required])],
      cdEmail:[this.outlet ? this.outlet['cdEmail']: '', Validators.compose([Validators.required])],
      cdContactFullName:[this.outlet ? this.outlet['cdContactFullName']: '', Validators.compose([Validators.required])],
      cdOfficePhoneNumber:[this.outlet ? this.outlet['cdOfficePhoneNumber']: '', Validators.compose([Validators.required])],
      contactName:[this.outlet ? this.outlet['contactName']: '', Validators.compose([Validators.required])],
      contactMobileNumber:[this.outlet ? this.outlet['contactMobileNumber']: '', Validators.compose([Validators.required])],
      remarks: [this.outlet ? this.outlet['remarks']: '', Validators.compose([Validators.required])]
       });
    //  }
   
    //  else {
    // this.formEdit = this.fb.group({ 
    //   outletName:[this.outlet ? this.outlet['outletName']: '', Validators.compose([Validators.required])],
    //   outletCode:[this.outlet ? this.outlet['outletCode']: '', Validators.compose([Validators.required])],
    //   outletType:[this.outlet ? this.outlet['outletType']: '', Validators.compose([Validators.required])],
    //   outletRoute:[this.outlet ? this.outlet['outletRoute']: '', Validators.compose([Validators.required])],
    //   location:[this.outlet ? this.outlet['location']: '', Validators.compose([Validators.required])],
    //   latitude:[this.outlet ? this.outlet['latitude']: '', Validators.compose([Validators.required])],
    //   longitude:[this.outlet ? this.outlet['longitude']: '', Validators.compose([Validators.required])],
    //   cdName:[this.outlet ? this.outlet['cdName']: '', Validators.compose([Validators.required])],
    //   cdCode:[this.outlet ? this.outlet['cdCode']: '', Validators.compose([Validators.required])],
    //   contactMobileNumber:[this.outlet ? this.outlet['contactMobileNumber']: '', Validators.compose([Validators.required])],
    // });
    //  }
    this.loadRoutes();
  }


 //add outlet
 addNewOutlet(){
  this._httpService.post("outlet/new", this.form.value)
  .subscribe({
   next:(res)=> {
     this.toastr.success("Outlet details added, awaiting approval", "Success!");
     this.form.reset();
   },
   error:()=>{
     this.toastr.error("Outlet details were not added", "Error!");
   },
  })
}

  //updates outlet details
  editOutlet(): void {
    const model = {
      id: this.outlet['id'],
      outletName: this.form.value.outletName,
      outletCode: this.form.value.outletCode,
      outletType: this.form.value.outletType,
      outletRoute: this.form.value.outletRoute,
      location: this.form.value.location,
      latitude: this.form.value.latitude,
      longitude: this.form.value.longitude,
      cdName: this.form.value.cdName,
      cdCode: this.form.value.cdCode,
      contactMobileNumber: this.form.value.contactMobileNumber,
      remarks: this.form.value.remarks,
      
      previousData: {
        id: this.outlet['id'],
        outletName: this.outlet["outletName"],
        outletCode: this.outlet["outletCode"],
        outletType: this.outlet["outletType"],
        outletRoute: this.outlet["outletRoute"],
        location: this.outlet["location"],
        latitude: this.outlet["latitude"],
        longitude: this.outlet["longitude"],
        cdName: this.outlet["cdName"],
        cdCode: this.outlet["cdCode"],
        contactMobileNumber: this.outlet['contactMobileNumber'],
        remarks: this.outlet['remarks']
      }
    };

    
    this._httpService.put("outlet/edit-outlet", model).subscribe(res => {
      console.log(res);
      
      if (res['status'] === "Success") {
        if(res["message"] = "Edited distributor successfully") {
          this.toastr.success("Outlet details updated, awaiting approval", "Success!");
          close();
        } else {
          this.toastr.success("Outlet details updated,", "Success!");
          close();
        }
        this.close();
        
      } else {
        this.toastr.error("Outlet details were not updated", "Error!");
        this.close();
      }
    })
  }


  loadRoutes(){
    this._httpService.getData("outlet/routes")
    .subscribe(res=>{
      this.routes = res['data']
      this.routes.map((x:any) => {
        this.routeNames.push(x.routeName)         
      })
      console.log(this.routeNames)

      this.routes.map((x:any) => {
        this.routeIds.push(x.id)          
      })
      console.log(this.routeIds)
    });
  }

  
  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
    
  }

}
