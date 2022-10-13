import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  form: FormGroup;
  page: number = 1;
  perPage: number = 10;
  user: any;
  users: any[];

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      userName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      phoneNumber: ['', Validators.compose([Validators.required])],
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      remarks: ['', Validators.compose([Validators.required])]
    });
    this.loadData();
  }

  //loads user details
  loadData(): void {
    let model = {
      page: this.page - 1,
      size: this.perPage
    };
    const id = this.data['id'];        
    console.log('edit user id: ', id);
    this._httpService.retrieveData("api/v1/user/list-users/active", model).subscribe(res => {
      console.log("users?", res);
      if (res['status'] == 'success') {
        this.users = res['data'];
        this.users.map(item => {
          if (item['userId'] == id) {
            this.user = item;
          }
        });
        console.log('selected user: ', this.user);
        this.form.patchValue({
          userName: this.user['userName'],
          email: this.user['email'],
          phoneNumber: this.user['phoneNumber'],
          firstName: this.user['firstName'],
          lastName: this.user['lastName'],
        })
      }
    })
  }

  //modifies user details
  editUser(): void {
    this.form.value.userId = this.data['id'];
    console.log('form value: ', this.form.value);
    this._httpService.post('api/v1/user/update-user', this.form.value).subscribe(res => {
      if (res['status'] === 'success') {
        console.log('edit res', res);
        this.toastr.success('User updated', 'Success!');
        this.close();
      } else {
        this.toastr.error('User details were not updated', 'Error!');
        this.close();
      }
    })
  }

  //closes creation dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
