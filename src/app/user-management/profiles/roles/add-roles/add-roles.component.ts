
import { ToastrService } from "ngx-toastr";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/shared/services/auth.service";
import { HttpService } from "src/app/shared/services/http.service";


@Component({
  selector: "app-add-roles",
  templateUrl: "./add-roles.component.html",
  styleUrls: ["./add-roles.component.scss"],
})
export class AddRolesComponent implements OnInit {

  title: any;

  url: string = "";
  _mode: string;
  id: any;
  parent_record_id: any;
  criteria: any = {};
  req_type: string;
  loading: boolean;
  rolesForm: FormGroup;
  _submitted: boolean;
  errorResponseMessage: string;
  successResponseMessage: string;
  transaction_details: any;
  username: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public formData: any,
    private fb: FormBuilder,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddRolesComponent>

  ) {
    // this.username = this.auth.currentUser['username']
   

  }
  ngOnInit(): void {
    //this._mode = this.mode;
    if (this.formData.mode === 'create') {
      this.title = "Create new role"
    } else {
      this.title = "Edit role"
    }
    this._submitted = false;
    this.loading = false;
    this.errorResponseMessage = "";
    this.successResponseMessage = "";
    this.rolesForm = this.fb.group({
      RoleName: [
        this.formData ? this.formData.data.RoleName : "",
        Validators.required,
      ],
      Description: [
        this.formData ? this.formData.data.Description : "",
        Validators.required,
      ],
      isActive: [
        this.formData ? this.formData.data.isActive : ""
      ]
    });
  }
  public save(): void {
    this.loading = true;
    this._submitted = true;
    this.transaction_details = {};
    this.httpService.post(this.transaction_details).subscribe(
      (result) => {
        result = result;
        const response_code = result.response.response_code;
        if (response_code !== "00") {
          switch (response_code) {
            case "99": {
              this._submitted = false;
              this.errorResponseMessage = "Validation Errors";
              break;
            }
            case "05": {
              this._submitted = false;
              this.errorResponseMessage =
                "Profile with the same name already exists";
              break;
            }
            default: {
              this._submitted = false;
              this.errorResponseMessage = result.response.error_data;
              break;
            }
          }
        } else {
          this.toastrService.success("Record created successfully", "Success");
          //} else if ( this._mode === 'update' ) {
          //   this.successResponseMessage = 'Changes saved Successfully';
          //}
          title: this.closeModal();
        }
      },
      (error) => {
        this._submitted = false;
        this.errorResponseMessage = "Server Error: Please retry again";
        this.httpService.getError(error);
      }
    );
  }
  public createRole(): void {
    this.loading = true;
    this._submitted = true;
    this.transaction_details = {
      service: "addrole",
      // "username": this.username,
      "RoleName": this.rolesForm.value.RoleName,
      "Description": this.rolesForm.value.Description,
      "isActive": this.rolesForm.value.isActive
    }
    

    this.httpService.post("Roles", this.transaction_details).subscribe(
      (result) => {
            this.loading = true;
        
        // if (result.status == 200) {
          // alert("Success!!")
          this.toastr.success("Role Added!")
        // }
        this.loading = false;
      
          this.dialogRef.close();
       
      },
      err => {
        this.dialogRef.close();
return this.httpService.getError(err);

      },
      complete => { this.loading = false, complete },
      (error) => {
       error = error
      }
    );
  }
  public editRole() {
    this.loading = true;
    this._submitted = true;
    this.transaction_details = {
      // service: "updaterole",
      // "username": this.username,
      "RoleId": this.formData.data.RoleId,
      "RoleName": this.rolesForm.value.RoleName,
      "Description": this.rolesForm.value.Description,
      "isActive": this.rolesForm.value.isActive
    }
   

    this.httpService.put(`Roles/${this.formData.data.RoleId}`, this.transaction_details).subscribe(
      (result) => {
       console.log(this.formData.data.RoleId)
        this.loading = true;
        result = result;
        // if (result.status == 200) {
          // alert("Success!!")
          this.toastr.success("Role Updated!")
        // }
        this.loading = false;
     
          this.dialogRef.close();
       
      },
      err => {
        this.dialogRef.close();
return this.httpService.getError(err);

      },
      (complete) => { this.loading = false; complete= complete },
      (error) => {
        error = error
      }
    );
  }
  public closeModal(): any {
this.dialogRef.close();
  }
}
