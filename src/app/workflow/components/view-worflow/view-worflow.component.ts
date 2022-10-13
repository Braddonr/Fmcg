import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';


import { AddWorflowStepComponent } from '../add-worflow-step/add-worflow-step.component';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-view-worflow',
  templateUrl: './view-worflow.component.html',
  styleUrls: ['./view-worflow.component.scss']
})
export class ViewWorflowComponent implements OnInit {

  editBool: boolean;
  firstStep: any;
  loading: boolean = false;
  secondStep: any;
  viewLinear: boolean = false;
  workflow: any;
  workflowSteps: any[] = [];

  constructor(
    public dialog: MatDialog,
    private _httpService: HttpService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getWorkflowSteps();
  }

  //triggers workflow step creation dialog
  triggerModal(data: any): void {
    this.editBool = false;
    const id = this.route.snapshot.paramMap.get("id");
    const dialogRef = this.dialog.open(AddWorflowStepComponent, {data: {workflow: data, workflowId: id, editBool: this.editBool}, height: '490x', width: '480px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.getWorkflowSteps();
    })
  }

  //edits workflow step
  editStep(data: any, step: any): void {
    this.editBool = true;
    const id = this.route.snapshot.paramMap.get("id");
    const dialogRef = this.dialog.open(AddWorflowStepComponent, {data: {workflow: data, step: step, workflowId: id, editBool: this.editBool}, height: '550x', width: '480px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.getWorkflowSteps();
    })
  }

  //retrieves workflow steps info
  getWorkflowSteps(): void {
    this.loading = true
    const id = +this.route.snapshot.paramMap.get("id");
    let model = {
      id: id
    };
    this._httpService.post("api/v1/workflow/get-workflowsteps-by-workflow", model).subscribe(res => {
      if (res['status'] === 200) {
        this.workflow = res['data']['workflow'];
        this.workflowSteps = res['data']['workflow']['workflowStepsList'];
        this.workflowSteps = Array.from(new Set(this.workflowSteps));
        this.loading = false;
      } else {
        this.toastr.success("Workflow details cannot be retrieved at the moment", "Success!");
      }
    })
  }
}
