import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-block-unblock',
  templateUrl: './block-unblock.component.html',
  styleUrls: ['./block-unblock.component.scss']
})
export class BlockUnblockComponent implements OnInit {

  cardTitle: string;
  form: FormGroup;
  statusBool: boolean;

  constructor(
    public dialogRef: MatDialogRef<BlockUnblockComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.statusBool = this.data["status"];
    this.cardTitle = this.statusBool ? "Block User" : "Unblock User";
    this.form = this.fb.group({
      blocked: ['', Validators.compose([Validators.required])],
      remarks: [null, Validators.compose([Validators.nullValidator])]
    })
  }

  //blocks user
  blockThisUser(): void {
    let model = {
      id: this.data.data,
      remarks: this.form.value.remarks
    };
    this._httpService.post("api/v1/user/block-user", model).subscribe(res => {
      if (res["status"] === 200) {
        let successMessage = res["message"] == "Data staged successfully" ? "User blocked successfully, awaiting approval" : "User blocked successfully";
        this.toastr.success(successMessage, "Success!");
        this.close();
      } else {
        let errorMessage = res["message"] == "Data staged successfully" ? "User couldn't be blocked, staging failed" : "User could not be blocked";
        this.toastr.error(errorMessage, "Error!");
      }
    })
  }

  //unblocks user
  unBlockThisUser(): void {
    let model = {
      id: this.data.data,
      remarks: this.form.value.remarks
    };
    this._httpService.post("api/v1/user/unblock-user", model).subscribe(res => {
      if (res["status"] === 200) {
        let successMessage = res["message"] == "Data staged successfully" ? "User unblocked successfully, awaiting approval" : "User unblocked successfully";
        this.toastr.success(successMessage, "Success!");
        this.close();
      } else {
        let errorMessage = res["message"] == "Data staged successfully" ? "User couldn't be unblocked, staging failed" : "User could not be unblocked";
        this.toastr.error(errorMessage, "Error!");
      }
    })
  }

  //closes dialog after 1 sec
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 1000);
  }

}
