import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-outlet-price',
  templateUrl: './add-outlet-price.component.html',
  styleUrls: ['./add-outlet-price.component.scss']
})
export class AddOutletPriceComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  price:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddOutletPriceComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updatePrice'];
    this.editData = this.data['updatePrice'];
    this.cardTitle = this.editData ? "Update Outlet Price Details": "Add New Outlet Price";
    this.price = this.data['data'];

    this.form = this.fb.group({
      productCode:[this.price ? this.price['productCode']: '', Validators.compose([Validators.required])],
      productDescription:[this.price ? this.price['productDescription']: '', Validators.compose([Validators.required])],
      unitPrice:[this.price ? this.price['unitPrice']: '', Validators.compose([Validators.required])],
      remarks:[this.price ? this.price['remarks']: '', Validators.compose([Validators.required])],
    });
  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
