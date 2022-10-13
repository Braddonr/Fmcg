import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-assign-profile',
  templateUrl: './assign-profile.component.html',
  styleUrls: ['./assign-profile.component.scss']
})
export class AssignProfileComponent implements OnInit {

  cardTitle: string;
  form: FormGroup;
  loading: boolean = false;
  page: number = 1;
  perPage: number = 200;
  profiles: any;

  constructor(
    public dialogRef: MatDialogRef<AssignProfileComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.loadData();
    console.log("user details: ", this.data);
    this.cardTitle =  `Assign ${this.data['data']['firstName']} a Profile`
    this.form = this.fb.group({
      profileId: ['', Validators.compose([Validators.required])]
    });
  }

  //retrieves available profiles
  loadData(): void {
    let model = {
      page: this.page - 1,
      size: this.perPage
    }
    this._httpService.retrieveData("api/v1/workflow/get-profiles", model).subscribe(res => {
      if (res['status'] === 200) {
        this.profiles = res['data']['content'];
      }
    })
  }

  //assigns user profile
  assignProfile(): void {
    this.loading = true;
    let model = {
      userEmail: this.data['data']['email'],
      profileId: +this.form.value.profileId
    };
    this._httpService.post("api/v1/workflow/add-profile-user", model).subscribe(res => {
      if (res['status'] === 200) {
        if (res["message"] == "Data staged successfully") {
          this.toastr.success(`${this.data['data']['firstName']} added to profile awaiting approval`, 'Success!');
          this.close();
        } else {
          this.toastr.success(`${this.data['data']['firstName']} added to profile`, 'Success!');
          this.close();
        }
        
      } else {
        this.toastr.error(`${this.data['data']['firstName']} was not added to the profile`, 'Error!');
        this.close();
      }
      this.loading = false;
    })
  }

  //closes assignation dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
