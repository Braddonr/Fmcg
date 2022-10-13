import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-worflow-step',
  templateUrl: './add-worflow-step.component.html',
  styleUrls: ['./add-worflow-step.component.scss']
})
export class AddWorflowStepComponent implements OnInit {

  cardTitle: string;
  checked: boolean = true;
  edit: boolean;
  form: FormGroup;
  loading: boolean;
  availableRoles: any[];
  roles: any;

  constructor(
    public dialogRef: MatDialogRef<AddWorflowStepComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.roles = this.data.step ? this.data.step.roles.name : '';
    console.log("role?", this.roles);
    this.edit = this.data['editBool'];
    this.cardTitle = this.edit ? "Edit Workflow Step" : "Add Workflow Step";
    this.form = this.fb.group({
      stepName: [this.data['step'] ? this.data['step']['stepName']: '', Validators.compose([Validators.required])],
      stepNo: [this.data['step'] ? this.data['step']['stepNo']: '', Validators.compose([Validators.required])],
      role: [this.roles, Validators.compose([Validators.required])],
      isFinal: [this.data['step'] ? this.data['step']['isFinal'].toString(): 'false', Validators.compose([Validators.nullValidator])],
      remarks: [this.data['step'] ? this.data['step']['remarks']: '', Validators.compose([Validators.nullValidator])],
      isActive: [this.data['step'] ? this.data['step']['isActive'].toString(): 'false', Validators.compose([Validators.required])]
    });
  }

  //retrieves available roles
  loadData(): void {
    let model = {
      page: 0,
      size: 10
    };
    this._httpService.retrieveData("api/v1/workflow/get-roles", model).subscribe(res => {
      console.log("available roles: ", res);
      if (res['status'] === 200) {
        this.availableRoles = res['data']['content'];
      }
    })
  }

  //saves workflow step
  submitData(): void {
    this.loading = true;
    let finalStatus;
    finalStatus = this.form.value.isFinal == "true" ? true : false;
    let activeStatus = this.form.value.isActive == "true" ? true : false;
    let model = {
      workflowId: Number(this.data['workflowId']),
      stepName: this.form.value.stepName,
      stepNo: Number(this.form.value.stepNo),
      roleId: Number(this.form.value.role),
      isFinal: finalStatus,
      isActive: activeStatus,
      remarks: this.form.value.remarks
    }
    // console.log("form value: ", model);
    this._httpService.post("api/v1/workflow/add-workflowstep", model).subscribe(res => {
      if (res['status'] === 200) {
        this.loading = false;
        this.toastr.success("Workflow step added", "Success!");
        this.close();
      } else {
        this.loading = false;
        this.toastr.error(res['message'], "Error");
        this.close();
      }
    })
  }

  //edits workflow step
  editData(): void {
    this.loading = true;
    let finalStatus;
    finalStatus = this.form.value.isFinal == "true" ? true : false;
    let activeStatus = this.form.value.isActive == "true" ? true : false;
    //console.log("form value: ", this.form.value);
    let model = {
      id: Number(this.data['step']['id']),
      workflowId: Number(this.data['workflow']['id']),
      stepName: this.form.value.stepName,
      stepNo: Number(this.form.value.stepNo),
      roleId: Number(this.form.value.role),
      isFinal: finalStatus,
      isActive: activeStatus,
      remarks: this.form.value.remarks
    };
    //console.log("edit model: ", model);
    this._httpService.post("api/v1/workflow/edit-workflowstep", model).subscribe(res => {
      if (res['status'] == 200) {
        this.loading = false
        this.toastr.success("Workflow step updated", "Success");
        this.close();
      } else {
        this.loading = false;
        this.toastr.error(res.message, "Error!");
        this.close();
      }
    })
  }

  //closes creation dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
