import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  _userID: any;
  userData: any;
  itemUser: any;
  transaction_request = {};
  status_value: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private httpService: HttpService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this._userID = this.activeRoute.snapshot.params['id']


    this.userData = JSON.parse(localStorage.getItem('user'))
    console.log(this.userData);





  }

  ngOnInit() {

    this.loadUserData()
  }
  opensweetalert() {
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }
  opensweetalertdng() {
    Swal.fire('Oops...', 'Something went wrong!', 'error');
  }

  opensweetalertcst() {
    Swal.fire({
      title: 'Are you sure to unblock?',
      text: 'This user will resume the roles in the system',
      icon: 'question',
      iconHtml: '<i class="fa fa-question fa-sm"></i>',
      inputPlaceholder: 'Remarks',
      input: 'text',
      width: 400,
      showCancelButton: true,
      confirmButtonColor: '#a32a29',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes'

    }).then((result) => {
      if (result.value) {
        Swal.fire(
          {
            icon: "success",
            title: 'User unblocked!',
            text: 'Account is now active.' +
              'success',
            timer: 2000,

            showConfirmButton: false
            // background: '#2EC852',

          }
        )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }
  loadUserData() {
    this.httpService.getReportData('ApplicationUser/AllUsers').subscribe(result => {
      let dataArray = result['data']['content'];
      this.itemUser = dataArray.filter(item => {
        return item.Id === this._userID;
      })[0];

      console.log(this.itemUser)

    })
  }
  blockUser() {

    this.transaction_request = {
      "service": "userManagement",
      "service_code": "blockUser",

      "ProfileId": this._userID
    }
    this.httpService.post(`ApplicationUser/BlockUser?Id=${this.itemUser.Id}`, this.transaction_request).subscribe(result => {

      if (result.status == '200') {
        this.toastr.success("User Blocked Successfully");
      }
      this.loadUserData()

    },
      err => {
        this.httpService.getError(err);
      })
  }
  suspendUser(data: any) {

    this.transaction_request = {
      "service": "userManagement",
      "service_code": "suspendUser",
      "user_id": data.userid
    }
  }
  unSuspendUser(data: any) {

    this.transaction_request = {
      "service": "userManagement",
      "service_code": "unSuspendUser",
      "user_id": data.userid
    }
  }
  unblockUser(data: any) {

    this.transaction_request = {
      "service": "userManagement",
      "service_code": "unblockUser",
      "ProfileId": this._userID
    }
    this.httpService.post(`ApplicationUser/BlockUser?Id=${this.itemUser.Id}`, this.transaction_request).subscribe(result => {

      if (result.status == '200') {
        this.toastr.success("User unblocked Successfully")
      }
      this.loadUserData()

    },
      err => {
        this.httpService.getError(err);
      })
  }

  openDialog(data) {
    let dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '400px',
      data: {
        data: data.Id,

      }

    })
    dialogRef.afterClosed().subscribe(res => {
      this.loadUserData();
      console.log(res)
    })
  }

}
