import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';

import { ColumnItem } from '../../../shared/models/column-item';

import { Workflow } from '../../models/workflow';
import { AddWorkflowComponent } from '../add-workflow/add-workflow.component';
import { DataExportationService } from 'src/app/shared/services/data-exportation.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-all-workflows',
  templateUrl: './all-workflows.component.html',
  styleUrls: ['./all-workflows.component.scss']
})
export class AllWorkflowsComponent implements OnInit {

  cardTitle: string;
  ColumnItem: ColumnItem;
  columnsToJSON: any = {};
  editData: boolean;
  endDate: string;
  exportTitle: string;
  listOfColumns = ['ID', 'Workflow Name', 'Status', 'Created On', 'Description', 'Role Id'];
  
  loading: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  paginationSize: number;
  startDate: string;
  total: number;
  workflow: Workflow;
  workflowColumns: string[];
  workflowRows: any[];
  workflows: any[];

  constructor(
    public dialog: MatDialog,
    private _dataExportationService: DataExportationService,
    private _httpService: HttpService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
  }

  ngOnInit(): void {
    this.getWorkflows();
  }

  //retrieves all workflows
  getWorkflows(): void {
    this.loading = true;
    this.cardTitle = "Available Workflows";
    let model = {
      page: this.page - 1,
      size: this.pageSize
    };
    this._httpService.retrieveData("api/v1/workflow/get-workflows", model).subscribe(res => {
      if (res["status"] === 200) {
        this.workflows = res['data']['content'];
        let cols = []
        this.workflows.map(workflow => {
          Object.keys(workflow).map(col => {
            cols.push(col);
          })
        })
        cols = Array.from(new Set(cols));
        cols.map(item => {
          switch(item) {
            case "id":
              this.columnsToJSON["ID"] = "id";
              break;
            case "name":
              this.columnsToJSON["Workflow Name"] = "name";
              break;
            case "remarks":
              this.columnsToJSON["Description"] = "remarks";
              break;
            case "isActive":
              this.columnsToJSON["Status"] = "isActive";
              break;
            case "roleId":
              this.columnsToJSON["Role ID"] = "roleId";
              break;
            case "createdOn":
              this.columnsToJSON["Created On"] = "createdOn";
              break;
          }
        })
        this.total = res['data']['totalElements'];
        this.loading = false;
      } else {
        this.toastr.error("Workflows cannot be retrieved", "Error!");
        this.loading = false;
      }
    })
  }

  //updates request params
  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.page = pageIndex;
    this.pageSize = pageSize;
    this.getWorkflows();
  }  

  //triggers workflows creation dialog
  addWorkflow(data: any): void {
    this.editData = false;
    const dialogRef = this.dialog.open(AddWorkflowComponent, {data: {data: data, edit: this.editData}, height: '500px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.getWorkflows();
    });
  }

  //triggers workflows edit dialog
  editWorkflow(data: any): void {
    this.editData = true;
    const dialogRef = this.dialog.open(AddWorkflowComponent, {data: {data: data, edit: this.editData}, height: '500px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      if (data) {
        this.getWorkflows();
      }
    });
  }

  //captures selected date range
  datedData(dateStart: HTMLInputElement, dateEnd: HTMLInputElement): void {
    
    this.getWorkflows();
  }

  //navigates to single workflow view
  viewWorkflow(element): void {
    this.router.navigate(['/workflow/manage-workflow/', element.id]);
  }

  //exports workflows to xlsx
  exportWorkflowXLSX(): void {
    let workflowToExport = [];
    this.workflows.map(item => {
      if (item["isActive"] == true) {
        item["isActive"] = "Active";
      } else {
        item["isActive"] = "Inactive";
      }
      let container = {};
      this.listOfColumns.map(col => {
        container[col] = item[this.columnsToJSON[col]];
        workflowToExport.push(container);
      })
    });
    let entries = this.getUniqueListBy(workflowToExport, "ID");
    this.exportXLSX(entries, "workflow-list");
  }

  exportXLSX(dataArray, title): void {
    this._dataExportationService.exportDataXlsx(dataArray, title);
  }

  private getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  //exports workflows to PDF
  exportWorkflowPDF(): void {
    this.exportTitle = "worflow-list.pdf";
    this.workflowColumns = this.listOfColumns;
    this.workflowRows = this.workflows.map(workflow => {
      let container = [];
      this.listOfColumns.map(col => {
        container.push(workflow[this.columnsToJSON[col]]);
      })
      return container;
    })
    this.exportToPDF(this.workflowColumns, this.workflowRows, this.exportTitle);
  }

  exportToPDF(cols, rows, title): void {
    this._dataExportationService.exportToPdf(cols, rows, title);
  }
}
