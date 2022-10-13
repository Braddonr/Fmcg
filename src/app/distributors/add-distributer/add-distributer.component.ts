import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-distributer',
  templateUrl: './add-distributer.component.html',
  styleUrls: ['./add-distributer.component.scss']
})
export class AddDistributerComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  cooler:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;
  loadedCode: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddDistributerComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updateDistributor'];
    this.editData = this.data['updateDistributor'];
    this.cardTitle = this.editData ? "Update Distributor Details": "Add New Distributor";

    this.cooler = this.data['data'];

    console.log(this.cooler);
    console.log(this.cooler.id)

    this.loadedCode= this.cooler.territoryCode;


    this.form = this.fb.group({
      // model:[this.cooler ? this.cooler['model']: '', Validators.compose([Validators.required])],
      // assetNumber:[this.cooler ? this.cooler['assetNumber']: '', Validators.compose([Validators.required])],
      // coolerSize:[this.cooler ? this.cooler['coolerSize']: '', Validators.compose([Validators.required])],
      // status:[this.cooler ? this.cooler['status']: '', Validators.compose([Validators.required])],
      cdName:[this.cooler ? this.cooler['cdName']: '', Validators.compose([Validators.required])],
      cdCode:[this.cooler ? this.cooler['cdCode']: '', Validators.compose([Validators.required])],
      cdContactFullName:[this.cooler ? this.cooler['cdContactFullName']: '', Validators.compose([Validators.required])],
      cdContactMobileNumber:[this.cooler ? this.cooler['cdContactMobileNumber']: '', Validators.compose([Validators.required])],
      cdEmail:[this.cooler ? this.cooler['cdEmail']: '', Validators.compose([Validators.required])],
      // postalAddress:[this.cooler ? this.cooler['postalAddress']: '', Validators.compose([Validators.required])],
      regionCode:[this.cooler ? this.cooler['regionCode']: '', Validators.compose([Validators.required])],
      territoryCode:[this.cooler ? this.cooler['territoryCode']: '', Validators.compose([Validators.required])],
      remarks:[this.cooler ? this.cooler['remarks']: '', Validators.compose([Validators.required])],
    }); 
  }

  addNewDistributor(){
    this._httpService.post("distributor/add", this.form.value)
    .subscribe({
     next:(res)=> {
       this.toastr.success("Outlet details added", "Success!");
       this.form.reset();
     },
     error:()=>{
       this.toastr.error("Outlet details were not added", "Error!");
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
    
    this._httpService.put("distributor/edit-distributor", model).subscribe(res => {
      if (res['status'] === "Success") {
        if(res["message"] = "Outlet added successfully!") {
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

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
