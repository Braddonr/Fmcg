import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-list-user-details',
  templateUrl: './list-user-details.component.html',
  styleUrls: ['./list-user-details.component.scss']
})
export class ListUserDetailsComponent implements OnInit {
  public settings = {
    selectMode: "single", // single|multi
    hideHeader: false,
    hideSubHeader: false,
    actions: {
      columnTitle: "Actions",
      add: false,
      edit: false,
      delete: false,
      custom: [
        // {
        //   name: "viewUser",
        //   title:
        //     '<i class="br" title="View This Profile"><i class="fa fa-eye text-primary"></i></i>&nbsp;&nbsp;',
        // },
        // {
        //   name: "recordAddUpdate",
        //   title:
        //     '<i class="br" title="Edit user"><i class="fa fa-pencil text-info"></i></i>&nbsp;',
        // },
        // {
        //   name: "deleteRecord",
        //   title:
        //     '<i class="br" title="Delete user"><i class="fa fa-trash text-danger"></i></i>',
        // },
      ],
      position: "right" // left|right
    },
    noDataMessage: "No data found",
    columns: {
      fullname: {
        title: "FULL NAME",
        type: "text"
      },
      username: {
        title: "USERNAME",
        type: "string"
      },
      email: {
        title: "EMAIL",
        type: "string"
      },
      address: {
        title: "ADDRESS",
        type: "string"
      },
      status: {
        title: "STATUS ",
        type: "string"
      },
      date_created: {
        title: "DATE",
        type: "string"
        // valuePrepareFunction: (date) => {
        //   const raw = new Date(date);
        //   // const formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:MM:ss');
        //   return formatted;
        // },
      },
    },
    pager: {
      display: true,
      perPage: 3
    },
    attr: {
      class: "table table-bordered"
    }
  };
  dataSet
  _userID: any;
  userData: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private httpService: HttpService
  ) {
    this._userID = this.activeRoute.snapshot.params['id']
  }

  ngOnInit() {
    // console.log(String(this._userID));
    this.loadUserData()
  }
  loadUserData() {
    // let user_request = {
    //   "service": "userManagement",
    //   "service_code": "userDetails",
    // }
    // console.log(user_request);

    // this.httpService.post(user_request).subscribe(result => {
    //   this.userData = result;
    //   // console.log(this.userData);



    // })
  }
  onCustomAction(event: any) {
    event
  }
}
