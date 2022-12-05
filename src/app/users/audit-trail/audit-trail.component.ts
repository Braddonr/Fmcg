import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';
import { DataExportationService } from 'src/app/shared/services/data-exportation.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';




@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {

  @Input() toolTipViewTitle: string = "View Details";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';
  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';
  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  lAuditTrail: any;
  exportAuditColumns: string[];
  exportAuditRows: any[];
  auditTrails: any[];
  cardTitle: string;
  columnsToJSON: any = {};
  email: string = "";
  endDate: any;
  exportTitle: string;
  indicatedColumns: string[];
  listColumns: any[] = [];
  listOfDisplayData: any[];
  loading: boolean = false;
  mandatoryColumns: string[];
  page: number = 1;
  perPage: number = 100;
  requestAgent: string = "";
  requestMethod: string = "";
  selectedAgent: string = "";
  selectedDate: string = "";
  selectedEmail: string;
  selectedMethod: string;
  startDate: any;
  total: number;
  userEmail: string = "";
  visible: boolean = false;
  visibleDate: boolean = false;
  visibleEmail: boolean = false;
  listOfData:any[]=[];
  listOfDataToDisplay:any[]=[];

  constructor(
    private _dataExportationService: DataExportationService,
    private _globalService: GlobalService,
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService,
    private global: GlobalService
  ) {
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
   }

  ngOnInit(): void {
    this.loadData();
    this.loadMockAuditTrails();
    this.cardTitle = "Audit Trails";
  }

  loadMockAuditTrails(){
  this.loading=true;
    //use local server as endpoints are down
this._httpService.getMockData()
.subscribe(res => {
 
 this.loading = false;
 this.listOfData = res
 // console.log('Cooler-Companies');
 // console.log(this.listOfData);

 this.listOfDataToDisplay = [...this.listOfData];
});
  }
  
  //loads users' audit trails
  private fetchAuditTrail(model): void {
    this._httpService.postAudit("api/v1/logs/get", model).subscribe(res => {
      if (res["status"] == 200) {
        this.auditTrails = res['data']['content'];
        let listColumns = [];
        this.auditTrails.map(trail => {
          Object.keys(trail).map(ky => {
            listColumns.push(ky);
          })
        });
        Array.from(new Set(listColumns)).map(item => {
          switch(item) {
            case "id":
              this.columnsToJSON["ID"] = "id";
              break;
            case "userEmail":
              this.columnsToJSON["User Email"] = "userEmail";
              break;
            case "uri":
              this.columnsToJSON["Accessed URI"] = "uri";
              break;
            case "methodType":
              this.columnsToJSON["Method Type"] = "methodType";
              break;
            case "responseStatus":
              this.columnsToJSON["Response Status"] = "responseStatus";
              break;
            case "requestDate":
              this.columnsToJSON["Request Time"] = "requestDate";
              break;
            case "userAgent":
              this.columnsToJSON["User Agent"] = "userAgent";
              break;
          }
        });
        this.total = res['data']['totalElements'];
        this.loading = false;
      } else {
        this.toastr.error("Audit trails cannot be retrieved at the moment", "Error!")
        this.loading = false;
      }
    })
  }

  loadData(): void {
    this.loading = true;
    let model = {
      page: this.page - 1,
      size: this.perPage,
      from: this.startDate,
      to: this.endDate
    };
    if (this.email) {
     model["userEmail"] = this.email;
    };
    if (this.selectedMethod) {
      model["methodType"] = this.selectedMethod;
    }
    if(this.selectedAgent) {
      model["userAgent"] = this.selectedAgent;
    }
    this.fetchAuditTrail(model);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadData();
  }

  //updates request body if user email is provided
  onEmailSelect(event): void {
    this.email = event;
    this.loadData();
  }

  //navigates to audit trail details page
  viewAudit(element): void {
    this.lAuditTrail = element;
    this.router.navigate(['users/view-audit-trail/', element.id]);
  }

  //displays audit trails within indicated date range
  onDateSelect(event): void {
    this.startDate = new Date(event[0]).toISOString().slice(0,10);
    this.endDate = new Date(event[1]).toISOString().slice(0,10);
    this.loadData();
  }

  //displays audit trails by request method type'
  onMethodSelect(event): void {
    this.selectedMethod = event;
    this.loadData();
  }

  //displays audit trails by user agent
  onUserAgentSelect(event): void {
    this.selectedAgent = event;
    this.loadData();
  }

  //exports audit trails to xslx
  exportXLSX(): void {
  let element = document.getElementById('basicTable');
  this.global.exportTableElmToExcel(element, 'Audit Trails');
  }

  //exports audit trails to PDF
  exportToPDF(): void {
    let element = 'table'
  let PDFTitle = 'Audit Trails';
  this.global.exportPDF(element, 'Audit Trails', PDFTitle);
  }

  //exports audit trail to CSV
  exportToCSV(): void {
    this.global.exportToCsv(this.listOfDataToDisplay,
      'Audit Trails', ['email', 
      'uri',
      'methodType',
      'status',
      'requestDate',
      // 'createdOn',
      ]);
  }
  

  //resets filters
  reset(): void {
    this.email = "";
    this.userEmail = "";
    this.requestMethod = "";
    this.selectedDate = "";
    this.selectedMethod = "";
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
    this.loadData();
  }
}
