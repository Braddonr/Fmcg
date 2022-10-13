import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AssignUserToProfileComponent } from './assign-user-to-profile/assign-user-to-profile.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-users-in-profile',
  templateUrl: './users-in-profile.component.html',
  styleUrls: ['./users-in-profile.component.scss'],
  providers: [DatePipe]
})
export class UsersInProfileComponent implements OnInit {
  mandatoryColumns: any[] = ["UserName", "Full Name", "A/C Status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  editData: boolean;
  page: number = 1;
  perPage: number = 10;
  total: number;
  searchValue = '';
  visible = false;
  listOfData: any;
  listOfDisplayData: any;
  searchInput = '';
  data_loaded: boolean = false;
  loading: boolean = false;

  userIDS: any[];

  dataSet: any;
  profile_request: {};
  username: any;
  profiles: any;
  profile_id: any;
  request_body: any;
  usersInProfile: any;
  constructor(
    private httpService: HttpService,
    private activeRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {

    this.profile_id = this.activeRoute.snapshot.params['id'];
    this.httpService.getReportData('ApplicationUser/AllUsers').subscribe(
      res => {
        let id = res['data']['content'];
        this.userIDS = id;
      }
    )
  }

  ngOnInit() {
    this.loadUsersInProfile();
  }

  assignUserDialog() {
    let dialogRef = this.dialog.open(AssignUserToProfileComponent, {
      width: '400px',
      data: {
        profile: this.profile_id
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadUsersInProfile()
    })
  }
  removeUser(user: any) {
    user = user
    Swal.fire({
      width: "350px",
      input: "textarea",
      inputPlaceholder: "Remarks",
      title: 'Are you sure to remove user?',
      showCancelButton: true,
      showCloseButton: false,
      showConfirmButton: true
    })
      .then((result) => {

        if (result.value) {
          this.request_body = {

            "service": "userManagement",
            "service_code": "removeUserFromProfile",

            "profile_id": this.profile_id
          }
          this.httpService.delete(`ApplicationUser/Profiles/${this.profile_id}`)
            .subscribe(result => {
              if (result.status === "200") {

                this.toastr.success("User removed from profile!")
                this.loadUsersInProfile()
              } else {
                this.toastr.error(result)
              }

            })

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire(
            'Cancelled',
            'Process cancelled by the user',
            'error'
          )
        }
      })
  }

  loadUsersInProfile() {
    this.loading = true;
    this.httpService.get(`UserProfile/${this.profile_id}`, this.page, this.perPage).subscribe(res => {
      if (res) {
        this.loading = false;
        this.listOfData = res['data']['content'];
        this.total = res['data']['totalPages'];

        // concat fullname from applicationuser object items
        this.listOfData = this.listOfData.map(singleuser => {
          singleuser['ApplicationUser']['FullName'] = singleuser['ApplicationUser']['FirstName'] + " " + singleuser['ApplicationUser']['MiddleName'] + " " + singleuser['ApplicationUser']['LastName']
          return singleuser['ApplicationUser'];
        });

        this.listOfDisplayData = [...this.listOfData];
        let columns = [];
        this.listOfData.map(item => {
          Object.keys(item).map(itemKeys => {
            columns.push(itemKeys);
          })
        });
        this.columnsToExport = Array.from(new Set(columns));
        this.columnsToExport.map(item => {
          switch (item) {

            case 'UserName':
              this.columnsJson['UserName'] = 'UserName';
              break;
            case 'FullName':
              this.columnsJson['Full Name'] = 'FullName';
              break;
            case 'Active':
              this.columnsJson['A/C Status'] = 'Active';

            default:
              break;
          }
        });
        this.displayColumns = Object.keys(this.columnsJson);
        console.log('display columns', this.displayColumns);
      }
    }
    )
  }

  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadUsersInProfile();
  }

  selectedColumns(event): void {
    this.mandatoryColumns = event;
  }
  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item) =>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }

  globalSearch() {
    if (this.searchInput.length < 1) {
      return this.loadUsersInProfile();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) => {
        return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.FullName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
      })
    }

  }


}
