import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      approved: ['', Validators.compose([Validators.required])],
      remarks: [null, Validators.compose([Validators.nullValidator])]
    })
  }

  //approves created user
  approveUser(): void {
    let approveStatus = this.form.value.approved == "true" ? true : false;
    let model = {
      stagingId: this.data.stagingId,
      stepId: this.data.details.stepId,
      isApproved: approveStatus,
      remarks: this.form.value.remarks
    };
    this._httpService.post('api/v1/workflow/add-workflow-action', model).subscribe(res => {
      if (res['status'] === 200) {
        this.close();
      }
    })
  }

  //closes dialog after 1 sec
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
