import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  product: any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddProductComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { 
    this.editBool = this.data['updateProduct'];
    this.editData = this.data['updateProduct'];
    this.cardTitle = this.editData ? "Update Product Details": "Add New Product";

    this.product = this.data['data'];



    this.form = this.fb.group({
      category:[this.product ? this.product['category']: '', Validators.compose([Validators.required])],
      productCode:[this.product ? this.product['productCode']: '', Validators.compose([Validators.required])],
      packagingType:[this.product ? this.product['packagingType']: '', Validators.compose([Validators.required])],
      brand:[this.product ? this.product['brand']: '', Validators.compose([Validators.required])],
      unitId:[this.product ? this.product['unitId']: '', Validators.compose([Validators.required])],
      units:[this.product ? this.product['units']: '', Validators.compose([Validators.required])],
      productDescription:[this.product ? this.product['productDescription']: '', Validators.compose([Validators.required])],
      remarks:[this.product ? this.product['remarks']: '', Validators.compose([Validators.required])],
    });

    
  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
