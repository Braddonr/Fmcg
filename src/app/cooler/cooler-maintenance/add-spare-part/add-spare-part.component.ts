import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-spare-part',
  templateUrl: './add-spare-part.component.html',
  styleUrls: ['./add-spare-part.component.scss']
})
export class AddSparePartComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  spare:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddSparePartComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updateSpare'];
    this.editData = this.data['updateSpare'];
    this.cardTitle = this.editData ? "Update Spare Part Details": "Add New Spare Part";
    this.spare = this.data['data'];

    this.form = this.fb.group({
      sparePartName:[this.spare ? this.spare['sparePartName']: '', Validators.compose([Validators.required])],
      price:[this.spare ? this.spare['price']: '', Validators.compose([Validators.required])],
      currency:[this.spare ? this.spare['currency']: '', Validators.compose([Validators.required])],
      sparePartDescription:[this.spare ? this.spare['sparePartDescription']: '', Validators.compose([Validators.required])],
      coolerId:[this.spare ? this.spare['coolerId']: '', Validators.compose([Validators.required])],
    });
  }

  addNewSpare(){
    this._httpService.post("cooler/maintenance/part/add", this.form.value)
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
  editSpare(){
   const model = {
    sparePartName: this.form.value.sparePartName,
    price: this.form.value.price,
    currency: this.form.value.currency,
    sparePartDescription: this.form.value.sparePartDescription,
    coolerId: this.form.value.coolerId,
    id: this.spare['id'],
    previousData: {
      sparePartName: this.spare['sparePartName'],
      price: this.spare['price'],
      currency: this.spare['currency'],
      sparePartDescription: this.spare['sparePartDescription'],
      coolerId: this.spare['coolerId'],
      id: this.spare['id'],
    }
   };
   this._httpService.put("cooler/maintenance/part/edit", model).subscribe(res => {
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
