import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  order:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddOrderComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updateOrder'];
    this.editData = this.data['updateOrder'];
    this.cardTitle = this.editData ? "Update Order Details": "Add New Order";

    this.order = this.data['data'];

    this.form = this.fb.group({
      cdName:[this.order ? this.order['cdName']: '', Validators.compose([Validators.required])],

    });
  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
