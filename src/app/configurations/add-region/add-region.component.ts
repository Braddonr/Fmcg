import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.scss']
})
export class AddRegionComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  region:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddRegionComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  
  ngOnInit(): void {
    this.editBool = this.data['updateRegion'];
    this.editData = this.data['updateRegion'];
    this.cardTitle = this.editData ? "Update Region Details": "Add New Region";


    this.form = this.fb.group({
      regionName:[this.region ? this.region['regionName']: '', Validators.compose([Validators.required])],
      regionCode:[this.region ? this.region['regionCode']: '', Validators.compose([Validators.required])],
      regionDescription:[this.region ? this.region['regionDescription']: '', Validators.compose([Validators.required])],
      brand:[this.region ? this.region['brand']: '', Validators.compose([Validators.required])],
      unitId:[this.region ? this.region['unitId']: '', Validators.compose([Validators.required])],
      units:[this.region ? this.region['units']: '', Validators.compose([Validators.required])],
      productDescription:[this.region ? this.region['productDescription']: '', Validators.compose([Validators.required])],
      remarks:[this.region ? this.region['remarks']: '', Validators.compose([Validators.required])],
    });
  }
  
  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
