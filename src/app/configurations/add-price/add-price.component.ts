import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss']
})
export class AddPriceComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  price:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddPriceComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updatePrice'];
    this.editData = this.data['updatePrice'];
    this.cardTitle = this.editData ? "Update Price Details": "Add New Price";
    this.price = this.data['data'];
  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
