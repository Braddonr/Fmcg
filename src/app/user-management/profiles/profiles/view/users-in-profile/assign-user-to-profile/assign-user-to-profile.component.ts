import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { Data } from 'src/app/shared/models/general_command.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpService } from 'src/app/shared/services/http.service';
export interface RequestData {
  service: string,
  username: string
}

@Component({
  selector: 'app-assign-user-to-profile',
  templateUrl: './assign-user-to-profile.component.html',
  styleUrls: ['./assign-user-to-profile.component.scss']
})
export class AssignUserToProfileComponent implements OnInit {
  get_username: string
  transaction_request: RequestData
  users: [] = [];
  profiles: []=[];
  assignForm: FormGroup
  title: string = "Assign user to this profile"
  // assignment_request: { service: string; service_code: string; username: string; recipient_username: string; ProfileId: string; };
  
  constructor(private authService: AuthService,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AssignUserToProfileComponent>
  ) 

  
  {
    console.log('DATAA: ', this.data)
    // this.get_username = authService.currentUser['username']
    this.httpService.getReportData('ApplicationUser/AllUsers').subscribe( res => {
      this.users = res['data']['content'];
      console.log(this.users)
    });

    this.assignForm = this.formBuilder.group({
      UserId: ['', Validators.required]
    })
  }

  ngOnInit() {
    // this.loadUsers()
  }
  // loadUsers() {
  //   this.transaction_request = {
  //     "service": "getusers",
  //     "username": this.get_username
  //     "UserName": this.assignForm.value.UserName,

  //   }
  //   this.httpService.post(this.transaction_request).subscribe(result => {
  //     this.users = result.users_list;
  //   })
  // }
  submitUser() {
    let assignment_request = {
      // "service": "userManagement",
      // "service_code": "assignUserToProfile",
      // "username": this.get_username,
      "UserID": this.assignForm.value.UserId,
      "ProfileId": this.data.profile

    }
    console.log(assignment_request);
    this.httpService.post('UserProfile', assignment_request)
      .subscribe(res => {
        console.log("users assigned", res)
        if (res.status == 200) {
          this.toastr.success("User assigned successfully!")
        }
        this.closeModal()

      },
      err => {
        this.toastr.error("Unable to assign record!");
        this.closeModal();
      })

  }
  closeModal() {
    this.dialogRef.close()
  }

}
