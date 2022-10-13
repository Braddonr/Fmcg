import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-van-stock',
  templateUrl: './add-van-stock.component.html',
  styleUrls: ['./add-van-stock.component.scss']
})
export class AddVanStockComponent implements OnInit {
  cardTitle: string;
  updateVanStock: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddVanStockComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.cardTitle = this.updateVanStock ? "Update Van Stock Details": "Add New Van Stock";
  }


  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
