import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-approval-details',
  templateUrl: './approval-details.component.html',
  styleUrls: ['./approval-details.component.scss']
})
export class ApprovalDetailsComponent implements OnInit {

  public stagedArray: any[] = [];
  allData: any;
  currentData: any;
  curData: any;
  changedElements: any;
  form: FormGroup;
  len: number;
  loading: boolean = false;
  pendingUsers: any[];
  prevData: any;
  prevLength: number;
  stagedTitle: string;
  stagedDescription: string;
  stagingID: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ApprovalDetailsComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.form = this.fb.group({
      approved: ['', Validators.compose([Validators.required])],
      remarks: [null, Validators.compose([Validators.nullValidator])]
    })
  }

  //retrieves data to be displayed
  loadData(): void {
    this.allData = this.data;
    this.currentData = JSON.parse(this.data['action']['data']);
    this.curData = Object.fromEntries(Object.entries(this.currentData).slice(0,-1));
    this.prevData = this.currentData['previousData'];
    this.stagedTitle = this.data['action']['stepName'];
    let curEntries = Object.values(this.curData);
    let prevEntries = Object.values(this.prevData);
    let uniqueItems = [];
    let commonItems = [];
    prevEntries.map(prev => {
      curEntries.map(cur => {
        if (!prevEntries.includes(cur)) {
          uniqueItems.push(cur);
        } else if (!curEntries.includes(prev)) {
          commonItems.push(prev);
        }
      })
    })
    uniqueItems = Array.from(new Set(uniqueItems));
    commonItems = Array.from(new Set(commonItems));
    console.log("unique: ", uniqueItems);
    console.log("common: ", commonItems);
    this.stagingID = this.data['stagingId'];
  }

  //retrieves staged items that require action
  getNotifications(): void {
    this._httpService.get('api/v1/workflow/get-user-pending-actions').subscribe(res => {
      if (res['status'] === 200) {
        this.len = res['data'].length;
        this.stagedArray = res['data'];
      } else {
        this.toastr.error(res.message, 'Error!');
      }
    })
  }

 //approves staged item
 approveUser(): void {
  this.loading = true;
  let approveStatus = this.form.value.approved == "true" ? true : false;
  let model = {
    stagingId: this.data.stagingId,
    stepId: this.data.stepId,
    isApproved: approveStatus,
    remarks: this.form.value.remarks
  };
  this._httpService.post('api/v1/workflow/add-workflow-action', model).subscribe(res => {
    if (res['status'] === 200) {
      this.toastr.success("Action was executed successfully", "Success!");
      this.loading = false;
      this.getNotifications();
      this.close();
    } else {
      this.toastr.error("Action could not be executed", "Error!");
      this.loading = false;
    }
  })
}

  //closes dialog after 1 sec
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }
}
