import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "src/app/shared/services/http.service";

@Component({
  selector: "app-add-profiles-dialog",
  templateUrl: "./add-profiles-dialog.component.html",
  styleUrls: ["./add-profiles-dialog.component.scss"],
})
export class AddProfilesDialogComponent implements OnInit {
  title: any;
  loading: any;
  transactions_details: any;
  profileForm: FormGroup;
  errorMessage: string[] = [];
  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddProfilesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public form_data: any
  ) {
    if (form_data.mode) {
      this.title = "Add Profile"
    } else {
      this.title = "Edit profile"
    }
    this.profileForm = this.fb.group({
      ProfileName: [
        this.form_data.data ? this.form_data.data.ProfileName : "",
        Validators.required
      ],
      Remarks: [
        this.form_data.data ? this.form_data.data.Remarks : "",
        Validators.required
      ],
      IsVisible: [
        this.form_data.data ? this.form_data.data.IsVisible : false,
        Validators.required
      ]
    });
  }

  ngOnInit() {
  }
  createProfile() {
    this.loading = true;
    this.transactions_details = {
      ProfileName: this.profileForm.value.ProfileName,
      Remarks: this.profileForm.value.Remarks,
      IsVisible: this.profileForm.value.IsVisible
    };

    this.httpService.post("Profiles", this.transactions_details).subscribe(
      (result) => {
        if (result) {
          this.toastr.success("Profile Added Successfully!");
          this.closeModal();
        }
      },

      (error) => {
        this.toastr.error("Unable to create Profile!");
        return this.errorMessage = error['error']['ProfileName'];
      },
      (complete) => {
        complete
        this.loading = false;
      }
    );
  }
  updateProfile() {
    this.loading = true;
    this.transactions_details = {
      ProfileName: this.profileForm.value.ProfileName,
      Remarks: this.profileForm.value.Remarks,
      IsVisible: this.profileForm.value.IsVisible,
      ProfileId: this.profileForm.value.ProfileId
    };

    if (this.form_data.data.ProfileId !== undefined) {
      this.transactions_details['ProfileId'] = this.form_data.data.ProfileId;
      this.httpService.put(`Profiles/${this.form_data.data.ProfileId}`, this.transactions_details).subscribe(
        (result) => {
          // if (result.field39 === "00") {
          console.log(result);
          this.toastr.success("Profile Updated Successfully!");
          this.closeModal();
          // } else {
          //   this.toastr.error(result);
          // }
        },
        (error) => {
          this.errorMessage = error;
          this.closeModal();
          return this.httpService.getError(error)
        },
        (complete) => {
          complete
          this.loading = false;
        }
      );
    }
  }
  closeModal() {
    this.dialogRef.close();
  }
}
