import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { CustomValidators } from 'ng2-validation';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "src/app/shared/services/http.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-user-dialog",
  templateUrl: "./add-user-dialog.component.html",
  styleUrls: ["./add-user-dialog.component.scss"],
})
export class AddUserDialogComponent implements OnInit {
  userForm: FormGroup;
  button_loading: boolean = false;
  errorMessages: string[] = [];
  title: string;
  transaction_request: any;
  profile_request: any;
  profiles = [];
  branches: any;
  salutes: any;
  accounts: any;
  branchName: any;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private _httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public formData: any,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private httpService: HttpService,
    private router: Router
  ) {
    console.log(formData);
this.getMainItems();
    // retrieve profiles
    this.httpService.getReportData("Profiles").subscribe(res => {
      let data = res['data']['content'];
      this.profiles = data;
    })
    // retrieve branches
    this.httpService.getReportData("Branch").subscribe(res => {
      let data = res;
      this.branches = data;
    });
    if(!formData.mode){
    this.userForm = this._fb.group({
      Username: [
        this.formData.data.UserName,
        [Validators.required]
      ],
      Email: [
        this.formData.data.Email,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      Password: [
        this.formData.data.Password,
        Validators.compose([Validators.required])
      ],
      EmploymentNumber: [
        this.formData.data.EmploymentNumber,
        Validators.compose([Validators.required])
      ],
      Branch: [
        this.formData.data.Branch,
        Validators.compose([Validators.required])
      ],
      FirstName: [
        this.formData.data.FirstName,
        [Validators.required]
      ],
      LastName: [
        this.formData.data.LastName,
        [Validators.required]
      ],
      PhoneNumber: [
        this.formData.data.PhoneNumber,
        [Validators.required, CustomValidators.phone]
      ],
      MiddleName: [
        this.formData.data.MiddleName,
        [Validators.required]
      ],
      Salutation: [
        this.formData.data.Salutation,
        [Validators.required]
      ],
      Remarks: [
        this.formData.data.Remarks,
        [Validators.required],
      ]

    });
  } else {
    this.userForm = this._fb.group({
      Username: [
        null,
        [Validators.required]
      ],
      Email: [
        null,
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      Password: [
        null,
        Validators.compose([Validators.required])
      ],
      EmploymentNumber: [
        null,
        Validators.compose([Validators.required])
      ],
      Branch: [
        null,
        Validators.compose([Validators.required])
      ],
      FirstName: [
        null,
        [Validators.required]
      ],
      LastName: [
        null,
        [Validators.required]
      ],
      PhoneNumber: [
        null,
        [Validators.required, CustomValidators.phone]
      ],
      MiddleName: [
        null,
        [Validators.required]
      ],
      Salutation: [
        null,
        [Validators.required]
      ],
      Remarks: [
        null,
        [Validators.required],
      ]

    });
  }

    this.userForm.get('Password').setValue("KCBPOC#020");
  }
  ngOnInit() {
    if (this.formData.mode === "create") {
      this.title = "Create new user";
    } else {
      this.title = "Edit user details";
    }

    // get roles based on a profile
    this.profiles.map(id => {
      return id['ProfileId'];
    });



  }


getMainItems(){
  this.httpService.getReportData("ControlItems/GetSubItems?MainItemName=SALUTATION").subscribe(res => {
    this.salutes = res;
  });
}

  submitUser() {
    this.button_loading = true;
    this.transaction_request = {
      "PhoneNumber": this.userForm.value.PhoneNumber,
      "Username": this.userForm.value.Username,
      "Password": "KCBPoC#020",
      "Email": this.userForm.value.Email,
      "FirstName": this.userForm.value.FirstName,
      "MiddleName": this.userForm.value.MiddleName,
      "LastName": this.userForm.value.LastName,
      "Branch": this.userForm.value.Branch,
      "EmploymentNumber": this.userForm.value.EmploymentNumber,
      "Salutation": this.userForm.value.salutation,
      "Remarks": this.userForm.value.Remarks
    }

    if (this.formData.Id == undefined) {
      this.httpService.post('ApplicationUser/Register', this.transaction_request).subscribe(
        result => {
          if (result.status == 200 || result.status == 201) {
            this.button_loading = false;
            this.toastr.success("User created successfully", "Success");
            this.dialogRef.close();
          } else {
            console.log(result.status)
            switch (result.status) {
              case 403:
                this.dialogRef.close();
                // this.router.navigate(['/session/403']);
                Swal.fire({
                  title: 'FORBIDDEN!',
                  text: 'Sorry, you are not authorized to perform this operation!',
                  icon: 'warning',
                })
                break;
              case 400:
                this.toastr.error("Unable to create user!", "Error");
                this.errorMessages.push(result.error.errors);
                break;
              default:
                this.toastr.error("Unable to create user!");

            }
          }
        },
        err => {
          this.button_loading = false;
          console.log(err.error.errors)
          this.toastr.error("Unable to create user!", "Error");
          this.errorMessages.push(err.error.errors);
        });
    }
  }
  editUser() {
    this.button_loading = true;
    this.transaction_request = {
      "Salutation": this.userForm.value.salutation,
      "FirstName": this.userForm.value.FirstName,
      "MiddleName": this.userForm.value.MiddleName,
      "LastName": this.userForm.value.LastName,
      "Email": this.userForm.value.Email,
      "EmploymentNumber": this.userForm.value.EmploymentNumber,
      "Branch": this.userForm.value.Branch,
      "PhoneNumber": this.userForm.value.PhoneNumber,
      "Remarks": this.userForm.value.Remarks,
      "Password": "KCBPOC#020"
    }

    this._httpService.put(`ApplicationUser/UpdateUser?ID=${this.formData.data.Id}`, this.transaction_request).subscribe(result => {
      // if (result.status == 200 || result.status == 201) {
      //   this.button_loading = false;
      //   this.toastr.success("Successfully updated user");
      //   this.dialogRef.close();
      // } 
      
      if (result) {
        if (result.status = 200) {
          this.button_loading = false;
          this.toastr.success("Successfully updated user");
          this.dialogRef.close();
        }
      }
      // else {
      //   switch (result.status) {
      //     case 403:
      //       this.dialogRef.close();
      //       this.router.navigate(['/session/403']);
      //       break;
      //     case 400:
      //       this.toastr.error("Unable to update user!", "Error");
      //       this.errorMessages.push(result.error.errors);
      //       break;
      //     default:
      //       this.toastr.error("Unable to update user!");
      //   }
      // }
    }, err => {
        this.button_loading = false;
        this.toastr.error("Unable to update user", "Error");
        this.errorMessages.push(err.error.errors);
      });

  }
  closeDialog() {
    this.dialogRef.close();
  }
}
