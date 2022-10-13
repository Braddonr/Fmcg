import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.scss']
})
export class AddWorkflowComponent implements OnInit {

  cardTitle: string;
  editBool: boolean;
  errorMessage: string;
  form: FormGroup;
  loading: boolean;
  page: number = 1;
  prevRole: any;
  size: number = 100;
  systemRoles: any[] = [];
  workflow: any;

  constructor(
    public dialogRef: MatDialogRef<AddWorkflowComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.editBool = this.data['edit'];
    this.workflow = this.data['data'];
    this.cardTitle = this.editBool ? "Edit Workflow Details" : "Create New Workflow";
    this.form = this.fb.group({
      workflowName: [this.workflow ? this.workflow['name'] : '', Validators.compose([Validators.required])],
      description: [this.workflow ? this.workflow['remarks'] : '', Validators.compose([Validators.required])],
      role: [this.workflow ? this.workflow['roleId'].toString() : '', Validators.compose([Validators.required])],
      status: [this.workflow ? this.workflow['isActive'].toString() : '', Validators.compose([Validators.required])]
    });
  }

  //retrieves roles
  loadData(): void {
    let model = {
      page: this.page - 1,
      size: this.size
    };
    this._httpService.retrieveData('api/v1/workflow/get-roles', model).subscribe(res => {
      if (res['status'] === 200) {
        let roles = res['data']['content'];
        roles.map(role => {
          if (role['isSystemRole'] == true) {
            this.systemRoles.push(role);
          }
        });
        this.systemRoles.map(role => {
          if (role['id'] === this.workflow['roleId']) {
            this.prevRole = role;
          }
        })
      }
    })
  }

  //saves newly created workflow
  submitData(): void {
    this.loading = true;
    let activeStatus = this.form.value.status === "true" ? true : false;
    let model = {
      name: this.form.value.workflowName,
      remarks: this.form.value.description,
      roleId: +this.form.value.role,
      isActive: activeStatus
    }
    this._httpService.post('api/v1/workflow/add-workflow', model).subscribe(res => {
      if (res['status'] === 200) {
        this.loading = false;
        this.toastr.success("Workflow created", "Success!");
        this.close();
      } else {
        this.loading = false;
        this.errorMessage = res.message;
        //this.close();
      }
    })
  }

  //modifies the details of an existing workflow
  editDetails(): void {
    this.loading = true;
    let activeStatus = this.form.value.status === "true" ? true : false;
    let model = {
      id: Number(this.workflow['id']),
      roleId: Number(this.form.value.role),
      name: this.form.value.workflowName,
      remarks: this.form.value.description,
      isActive: activeStatus
    };
    this._httpService.post("api/v1/workflow/edit-workflow", model).subscribe(res => {
      if (res['status'] === 200) {
        this.loading = false;
        this.toastr.success("Workflow details updated", "Success!");
        this.close();
      } else {
        this.loading = false;
        this.errorMessage = res.message;
        this.toastr.error("Workflow details were not updated", "Error!");
        //this.close();
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
