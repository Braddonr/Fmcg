import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-assign-roles-to-profile',
  templateUrl: './assign-roles-to-profile.component.html',
  styleUrls: ['./assign-roles-to-profile.component.scss']
})
export class AssignRolesToProfileComponent implements OnInit {
  sys_request_roles: any
  system_roles: any;
  dataSet: any;
  unassigned_roles: any;
  profileData: any;
  searchText: any;
  allRoles: any;
  unAssignedRoles: any[] = [];
  assignedRoles: any;
  todoList: any[];
  _id: number;
  selectedOptionsToBeAdded: any[];
  selectedOptionsToBeRemoved: any[];
  addDisabled: boolean = false;
  removeDisabled: boolean = false;
  approveDisabled: boolean = false;
  rolesToAdd: string[];
  transaction_details: {};
  get_params: any;
  get_profile_id: number;
  errorMessage: string;
  username: any;
  profile_id: any;
  constructor(
    private _service: HttpService,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService
  
  ) {
    this.selectedOptionsToBeAdded = [];
    this.selectedOptionsToBeRemoved = [];
    this.profile_id = activeRoute.snapshot.params['ProfileId']
  }
  ngOnInit() {
    this.loadRolesInProfile()
    this.loadAllRoles();
  }
  loadRolesInProfile(): void {
    this.get_params = this.activeRoute.params.subscribe(params => {
      this.get_profile_id = Number(params['id']);
      console.log(this.get_profile_id)
    });
    this.transaction_details = {
      service: "getassignedroles",
   
      "ProfileId": String(this.get_profile_id)
    }
    this._service.getReportData(`Roles/GetRolesAll`)
      .subscribe(
        result => {
          console.log(result);
          // this.unAssignedRoles = [];
          // this.assignedRoles = result ? result : '';
          this.assignedRoles = result;
          console.log(this.assignedRoles);

          let assignedRolesIds = [];
          assignedRolesIds = this.assignedRoles ? this.assignedRoles.map((record) => {

            return record.RoleId;
          }) : '';

          this.allRoles ?
            this.allRoles.forEach(element => {
              if (assignedRolesIds.indexOf(element.RoleId) < 0) {
                this.unAssignedRoles.push(element);
              }
            }) : '';
          this.allRoles = [];
          assignedRolesIds = [];

        }
      );
  }
  loadAllRoles() {
    this.get_params = this.activeRoute.params.subscribe(params => {
      this.get_profile_id = Number(params['id']);
    });
    this.transaction_details = {
      "service": "unassignedroles",
      "ProfileId": this.get_profile_id
    };
    this._service.getReportData('Roles/GetRolesAll')
      .subscribe(
        result => {
          this.unAssignedRoles = result["data"]['content'];
          console.log(this.unAssignedRoles);

        },
        error => {
        },
        // complete => {
        //   this.loadRolesInProfile();
        // }
      );
    // return true;
  }
  sortTodos(): void {
    this.todoList.sort((a, b) => Number(a.completed) - Number(b.completed));
  }
  // @ViewChild roles: ElementRef
  onSelectedOptionsChangeA(role: string[]): void {
    // console.log(role);

    this.selectedOptionsToBeRemoved = [];
    this.selectedOptionsToBeAdded.push({ "RoleId": role['RoleId'] });
    this.removeDisabled = true;
    this.approveDisabled = true;
    this.addDisabled = false;
  }
  onSelectedOptionsChangeR(role: string[]): void {
    // console.log(role);
    this.approveDisabled = false;
    this.removeDisabled = false;
    this.addDisabled = true;
    this.selectedOptionsToBeAdded = [];
    this.selectedOptionsToBeRemoved.push({ "RoleId": role['RoleId'] });
  }
  addRoleToProfile(): void {
    this.get_params = this.activeRoute.params.subscribe(params => {
      this.get_profile_id = Number(params['id']);
    });
    this.transaction_details = {
      ProfileId: String(this.get_profile_id),
      // service: "assignroles",
      roles: this.selectedOptionsToBeAdded
    };
    console.log(this.transaction_details);

    this._service.post('Profiles',this.transaction_details).
      subscribe(result => {

        result = result
        if (result.status == '200') {
          this.toastr.success("Role added successfully")
        } else {
          this.toastr.error(result)
        }
        // console.log(result);

      },
        (error) => {
          this._service.getError(error);
        },
        (complete) => {
          complete
          this.selectedOptionsToBeAdded = []
          this.loadAllRoles();
        }
      );
  }
  approveMultipleRoles(): void {
    const parent = this;
    Swal.fire({
      // position: 'top-end',
      title: 'Approve?',
      text: 'Approve Roles In Profile',
      // type: 'warning',
      // input: 'textarea',
      inputPlaceholder: 'Remarks',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4cae4c',

      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve role(s)!',
    },
    ).then(function (result: any): any {
      Array.prototype.forEach.call(parent.selectedOptionsToBeRemoved, element => {

        if (result.value) {
          parent.approve(element);
          // parent.loadAllRoles()
          Swal.fire(
            'Approved',
            'Role(s) have been approved.',
            'success'
          );
          parent.loadRolesInProfile()
        } else if (result.dismiss === Swal.DismissReason.cancel) {

          this.alertService.failedAlert()

        }
        else {
          Swal.fire(
            'Failed to Approve',
            'Role(s) have Not been approved.',
            'error'
          );
          this.selectedOptionsToBeRemoved = [];
        }
      });

    });
  }
  approve(role_id: any): void {
    this.transaction_details = {
      "service": "approveAssignedRoles",
      "ProfileId": this.get_profile_id,
      "roles": [role_id]
    };
    // this._service.post(this.transaction_details)
    //   .subscribe(
    //     res => {
    //       res
    //       // this.loadAllRoles()

    //     },
    //     error => {
    //       error
    //     }
    //   );
  }
  removed: boolean = false;
  removeMultipleRoles(): void {
    const parent = this;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      //  position: 'top-end',
      title: 'Remove ?',
      text: 'Remove Role(s) from Profile',
      // type: 'question',
      // input: 'textarea',
      width: '300',
      inputPlaceholder: 'Remarks',
      showLoaderOnConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4cae4c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!',
    },
    ).then((result: any): any => {
     

      Array.prototype.forEach.call(parent.selectedOptionsToBeRemoved, element => {
        // console.log(element);

        if (result.value) {
          parent.remove(element);
          // parent.loadAllRoles()
          swalWithBootstrapButtons.fire(
            'Removed',
            'Role(s) have been removed.',
            'success'
          );
          parent.loadAllRoles()
          parent.loadRolesInProfile()
        } else if (result.dismiss === "cancel") {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Oops! seems like you\'ve changed your mind.',
            'error'
          );
        }
        else {
          this.toastr.error(result)
        }
      });

    });
  }
  remove(role_id: any): void {
    console.log(role_id);
    this.transaction_details = {
      "service": "removeAssignedRoles",
      "ProfileId": String(this.get_profile_id),
      "roles": this.selectedOptionsToBeRemoved
    }
    // console.log(this.transaction_details);


    // this._service.post(this.transaction_details)
    //   .subscribe(res => {
    //     // console.log(res);
    //     if (res.field39 !== '00') {
    //       // this.errorMessage = res.response.response_description
    //     }
    //   },
    //     error => {
    //       error
    //     }
    //   );
  }

}
