import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
form: FormGroup;
request = {};
userData;
  constructor(private fb: FormBuilder,
     private httpService: HttpService, 
     private toastr: ToastrService, 
     @Inject(MAT_DIALOG_DATA) public data: any,
     private dialogRef: MatDialogRef<ResetPasswordComponent>
     ) {
    this.form = this.fb.group({
      Remarks: [null, Validators.required]
    })
   }

  ngOnInit(): void {
  }

  sendReset(){
    this.request= {
      "Remarks": this.form.value.Remarks,
    }
    this.httpService.post(`ApplicationUser/ResetUserPassword?id=${this.data.data}`).subscribe(res => 
     { 
       if(res.status == 200 || res.status == 201){
        this.toastr.success("Reset request sent!");
        this.dialogRef.close();
      } else{
        this.httpService.getError(res['message']);
        this.dialogRef.close();
      }
    },
    err => {
      this.httpService.getError(err);
      this.dialogRef.close();
    })
  }

  close(){
    this.dialogRef.close();
  }

}
