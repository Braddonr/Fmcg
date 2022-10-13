import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;
  user: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }
 
  ngOnInit(): void {
    this.editBool = this.data['updateUser']
    
    this.editData = this.data['updateUser'];
    this.cardTitle = this.editData ? "Update User Details": "Add a New User";
    this.user = this.data['data'];

    // "email": "deddoh84@gmail.com",
    // "firstLogin": 0,
    // "firstName": "dedan",
    // "id": 0,
    // "lastName": "watiri",
    // "locked": 0,
    // "middleName": "njoroge",
    // "mobileNumber": "0740477891",
    // "profileId": 0,
    // "regionCode": "DU89",
    // "status": 0,
    // "territoryCode": "GG545",
    // "trials": 0,
    // "userName": "dedan"


    this.form = this.fb.group({
      firstName:[this.user ? this.user['firstName']: '', Validators.compose([Validators.required])],
      middleName:[this.user ? this.user['middleName']: '', Validators.compose([Validators.required])],
      lastName:[this.user ? this.user['lastName']: '', Validators.compose([Validators.required])],
      userName: [this.user ? this.user['userName']: '', Validators.compose([Validators.required])],
      email:[this.user ? this.user['email']: '', Validators.compose([Validators.email, Validators.required])],
      mobileNumber:[this.user ? this.user['mobileNumber'].slice(3): '', Validators.compose([Validators.required])],
      territoryCode:[this.user ? this.user['territoryCode']: '', Validators.compose([Validators.required])],
      regionCode:[this.user ? this.user['regionCode']: '', Validators.compose([Validators.required])],
      profileId:[this.user ? this.user['profileId']: '', Validators.compose([Validators.required])],
      // id:[this.user ? this.user['id']: '', Validators.compose([Validators.required])],
      // phoneNumberPrefix:[this.user ? this.user['phoneNumber'].slice(0,4): '', Validators.compose([Validators.required])]
    });
    if (this.editBool && this.user['email']) {
      this.form.controls.email.disable();
    } else {
      this.form.controls.email.enable();
    }
  }

  
  submitUsersDetails(model): void {
    this.loading = true;
    this._httpService.post('user/add', this.form.value)
    .subscribe(res => {
      if (res['responseCode'] === 200) {
        if (res["message"] == "Data staged successfully") {
          this.toastr.success('User created awaiting approval', 'Success!')
          this.close();
          this.loading = false;
        } else {
          this.toastr.success("User created successfully", "Success!");
          this.loading = false;
        }
        this.close();
      } else if (res['responseCode'] === 403) {
        this.errorMessage = this._httpService.loadErrorMessage();
        this.loading = false;
      } else {
        this.loading = false;
      }
    })
  }

  //add new user new code(bradd)
  addThisUser(){
    this._httpService.post("user/add", this.form.value)
    .subscribe({
     next:(res)=> {
       this.toastr.success("Outlet details added", "Success!");
       this.form.reset();
     },
     error:()=>{
       this.toastr.error("Outlet details were not added", "Error!");
  
     },
    })
  }

  //creates a new user
  addNewUser(): void {
    let model = {
      email: this.form.value.email,
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName,
      lastName: this.form.value.lastName,
      mobileNumber: this.form.value.mobileNumber,     //this.form.value.phoneNumberPrefix +
      regionCode: this.form.value.regionCode,
      territoryCode: this.form.value.territoryCode,
      userName: this.form.value.userName,
      profileId: this.form.value.profileId,
      previousData: {}
    };
    let newModel = {
      email: this.form.value.email,
      phoneNumber: this.form.value.phoneNumberPrefix + this.form.value.phoneNumber
    };
    this._httpService.post("api/v1/user/email-lookup", newModel).subscribe(res => {
      if (res["status"] === 200) {
        this.submitUsersDetails(model);
      } else if (res["status"] === 400) {
        this.errorMessage = res["message"];
        this.loading = false;
      }
    })
  }

  //updates user details
  editUser(): void {
    const model = {
      id: this.user['id'],
      email: this.user['email'],
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      phoneNumber: this.form.value.phoneNumberPrefix + this.form.value.phoneNumber,
      remarks: this.form.value.remarks,
      previousData: {
        id: this.data['data']['id'],
        email: this.user["email"],
        firstName: this.user["firstName"],
        lastName: this.user["lastName"],
        phoneNumber: this.user["phoneNumber"],
        remarks: this.user["remarks"]
      }
    };
    this._httpService.post("api/v1/user/update-user", model).subscribe(res => {
      if (res['status'] === 200) {
        if(res["message"] = "Data staged successfully") {
          this.toastr.success("User details updated, awaiting approval", "Success!");
        } else {
          this.toastr.success("User details updated", "Success!");
        }
        this.close();
      } else {
        this.toastr.error("User details were not updated", "Error!");
        this.close();
      }
    })
  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
