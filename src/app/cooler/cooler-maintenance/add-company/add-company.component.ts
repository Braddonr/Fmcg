import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  company:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddCompanyComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updateCompany'];
    this.editData = this.data['updateCompany'];
    this.cardTitle = this.editData ? "Update Company Details": "Add New Company";
    this.company = this.data['data'];

    this.form = this.fb.group({
      companyName:[this.company ? this.company['companyName']: '', Validators.compose([Validators.required])],
      email:[this.company ? this.company['email']: '', Validators.compose([Validators.required])],
      location:[this.company ? this.company['location']: '', Validators.compose([Validators.required])],
      contactName:[this.company ? this.company['contactName']: '', Validators.compose([Validators.required])],
      contactPhone:[this.company ? this.company['contactPhone']: '', Validators.compose([Validators.required])],
      remarks:[this.company ? this.company['remarks']: '', Validators.compose([Validators.required])],
    });
  }
  addNewCompany(){
    this._httpService.post("cooler/maintenance/company/add", this.form.value)
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
  editCompany(){
    const model = {
      companyName: this.form.value.companyName,
      email: this.form.value.email,
      location: this.form.value.location,
      contactName: this.form.value.contactName,
      contactPhone: this.form.value.contactPhone,
      remarks: this.form.value.remarks,
      id: this.company['id'],
      previousData: {
        companyName: this.company["companyName"],
        email: this.company["email"],
        location: this.company["location"],
        contactName: this.company["contactName"],
        contactPhone: this.company["contactPhone"],
        remarks: this.company["remarks"],
        id: this.company['id']
      }
    };
    this._httpService.put("cooler/maintenance/company/edit", model).subscribe(res => {
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
