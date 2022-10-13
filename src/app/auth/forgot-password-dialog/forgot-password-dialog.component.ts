import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {

  cardTitle: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    //console.log(this.data['user']);
    this.cardTitle = "Password Reset";
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required])]
    });
    this.form.patchValue({
      email: this.data['user']['email']
    });
  }

  //sends password reset email to user
  forgotPassword(): void {
    this.loading = true;
    let model = {
      email: this.form.value.email
    }
    this._httpService.post("api/v1/user/forget-password", model).subscribe(res => {
      //console.log(res);
      if (res['status'] === 200) {
        this.loading = false;
        this.toastr.success("Reset password link sent", "Success!");
        this.close();
      } else {
        this.loading = false;
        this.toastr.error("Password reset link could not be sent", "Error!");
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
