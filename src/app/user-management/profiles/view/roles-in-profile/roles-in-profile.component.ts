import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import Swal from 'sweetalert2';
import { Role } from '../models/role';

@Component({
  selector: 'app-roles-in-profile',
  templateUrl: './roles-in-profile.component.html',
  styleUrls: ['./roles-in-profile.component.scss']
})
export class RolesInProfileComponent implements OnInit {
  modelRole: Role = new Role();
  @Input() _profile: any;
  _id;
  roleArray=[];
  allRoles: any;
  unAssignedRoles: any = [];
  assignedRoles: any;
  todoList: any[];
  selectedOptionsToBeAdded: string[];
  selectedOptionsToBeRemoved: string[];
  newTodo: string;
  addDisabled: boolean = false;
  removeDisabled: boolean = false;
  approveDisabled: boolean = false;
  assignedById: any;
  constructor(private _service: HttpService, private activeRoute: ActivatedRoute) {
    // this.selectedOptionsToBeAdded = [];
    this.selectedOptionsToBeRemoved = [];
    this._id= this.activeRoute.snapshot.params['id']
  }

  ngOnInit(): void {
    this.loadAllRoles();
  }
  loadRolesInProfile(): void {
    
    this._service.getReportData(`ProfileRoles/${this._id}`)
      .subscribe(
        result => {
         
          let i: any;
          let _roles = result;
          i = _roles
          this.assignedById = i.map(value => {
            return value.Id;
            });
            console.log(this.assignedById)
          let assigned = i.map(value => {
            return value;
            });
            
          
          this.unAssignedRoles  = [];
          this.assignedRoles =    _roles;
          console.log("assigned", this.assignedRoles)
            let assignedRolesIds = [];
             assignedRolesIds = this.assignedRoles.map((record) => {
             return record.Role.RoleId;
            });
            this.allRoles.forEach(element => {
               if ( assignedRolesIds.indexOf(element.RoleId) < 0) {
                this.unAssignedRoles.push(element);
               }
             });
            this.allRoles = [];
            assignedRolesIds = [];
        }
      );
  }
  loadAllRoles(): boolean {
   
    this._service.getReportData('Roles/GetRolesAll')
      .subscribe(
        result => {
          this.allRoles = result['data']['content'];
          this.loadRolesInProfile();
        },
        error => {
          this._profile.httpService.getError(error);
        },

        // (complete) => {
        //   this.loadRolesInProfile();
        // }
      );
      return true;
      

  }

  sortTodos(): void {
    this.todoList.sort((a, b) => Number(a.completed) - Number(b.completed));
  }

  onSelectedOptionsChangeA(values: string[]): void {
    this.selectedOptionsToBeRemoved = [];
    this.selectedOptionsToBeAdded = values;
    this.removeDisabled = true;
    this.approveDisabled = true;
    this.addDisabled = false;
  }
  onSelectedOptionsChangeR(values: string[]): void {
    this.approveDisabled = false;
    this.removeDisabled = false;
    this.addDisabled = true;
    this.selectedOptionsToBeAdded = [];
    this.selectedOptionsToBeRemoved = values;
  }
  add(): void {

    // for each roleid selected, add the profile id and send as an object
    this.selectedOptionsToBeAdded.map(id => {
      let arraytosend: any;
      let arr = {
        "ProfileId": Number(this._id),
        "RoleID": Number(id)
      }
  arraytosend = arr;
      return this.roleArray.push(arraytosend)
     
    });
   
   
   this._service.post('ProfileRoles/CreateProfile', this.roleArray).
    subscribe(
      result => {
        console.log(result)
        result = result;
        this.loadAllRoles();
      },
      error => {});
  }
  approveMultipleRoles(): void {
      const parent = this;
      Swal.fire({
      // position: 'top-end',
       title: 'Approve ?',
       text: 'Approve Roles In Profile',
      //  type: 'question',
       input: 'textarea',
       inputPlaceholder: 'Remarks',
       showLoaderOnConfirm: true,
       showCancelButton: true,
       confirmButtonColor: '#4cae4c',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes, Approve roles!',
   })
   .then(function ( result: any ): any {
    parent.selectedOptionsToBeRemoved.forEach(element => {
      if (result.value) {
        parent.approve(element);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Oops! seems like you\'ve changed your mind.',
          'error'
        );
      }
    });
    if ( parent.loadAllRoles() ) {
      Swal.fire(
        'Approved',
        'Roles have been approved.',
        'success'
      );
    }
   });
  }
  approve(role_id: any): void {

    let data = {
      ProfileId: Number(this._id),
      RoleID: Number(role_id)
    }

    let approvalArray = [];
    approvalArray.push(data)
    this._service.post('ProfileRoles/ApproveProfile', approvalArray)
      .subscribe(
        res => {
          console.log("approval request", res)
        },
        error => {
        }
      );
}

removeMultipleRoles(): void {
  const parent = this;
  Swal.fire({
  // position: 'top-end',
   title: 'Remove ?',
   text: 'Remove Role(s) from Profile',
  //  type: 'question',
   input: 'textarea',
   inputPlaceholder: 'Remarks',
   showLoaderOnConfirm: true,
   showCancelButton: true,
   confirmButtonColor: '#4cae4c',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, remove roles!',
},
).then(function ( result: any ): any {
parent.selectedOptionsToBeRemoved.forEach(element => {
  console.log("Test remove selected:", result.value);
  if (result.value) {
    parent.remove(element);
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire(
      'Cancelled',
      'Oops! seems like you\'ve changed your mind.',
      'error'
    );
  }
});
if ( parent.loadAllRoles() ) {
  Swal.fire(
    'Approved',
    'Roles have been removed.',
    'success'
  );
}
});
}
remove(role_id: any): void {

let data = {
  ProfileId: Number(this._id),
  RoleID: Number(role_id),
}
let deletedRolesArray = [];
deletedRolesArray.push(data)
this._service.post(`ProfileRoles/DeleteProfile`, deletedRolesArray)
  .subscribe(
    res => {

      console.log("Deleted Roles", res);
    },
    error => {
      this._service.getError(error);
    }
  );
}
}
