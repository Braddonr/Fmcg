import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-van',
  templateUrl: './add-van.component.html',
  styleUrls: ['./add-van.component.scss']
})
export class AddVanComponent implements OnInit {
  cardTitle: string;
  updateVan: boolean;
  editBool: boolean;
  editData: boolean;
  van:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;
  loadedId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddVanComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }
  
  ngOnInit(): void {
    this.editBool = this.data['updateVan'];
    this.editData = this.data['updateVan'];
    this.cardTitle = this.editData ? "Update Van Details": "Add New Van";
    this.van = this.data['data'];
    console.log(this.data['data']);
    
    
    console.log(this.data['data']['salespersonId']);
    this.loadedId = this.data['data']['salespersonId'];
    


    this.form = this.fb.group({
      cdCode:[this.van ? this.van['cdCode']: '', Validators.compose([Validators.required])],
      vehicleType:[this.van ? this.van['vehicleType']: '', Validators.compose([Validators.required])],
      plateNumber:[this.van ? this.van['plateNumber']: '', Validators.compose([Validators.required])],
      salespersonId:[this.van ? this.van['salespersonId']: '', Validators.compose([Validators.required])],

      // userName:[this.van ? this.van['userName']: '', Validators.compose([Validators.required])],
    });
  }
  addNewVan(){
    this._httpService.post("distributor/vehicle/add", this.form.value)
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
 editVan(){
  const model={
    id: this.van["id"],
    cdCode: this.form.value.cdCode,
    vehicleType: this.form.value.vehicleType,
    plateNumber: this.form.value.plateNumber,
    salespersonId: this.form.value.salespersonId,
    previousdata: {
      id: this.van["id"],
      cdCode : this.van["cdCode"],
      vehicleType: this.van["vehicleType"],
      plateNumber: this.van["plateNumber"],
      salespersonId: this.van["salespersonId"]
    }
  };
  this._httpService.put("distributor/edit-vehicle", model).subscribe(res => {
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
