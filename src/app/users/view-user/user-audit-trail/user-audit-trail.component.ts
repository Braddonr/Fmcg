import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-user-audit-trail',
  templateUrl: './user-audit-trail.component.html',
  styleUrls: ['./user-audit-trail.component.scss']
})
export class UserAuditTrailComponent implements OnInit {

  @Input() user: any;
  auditTrails: any[];
  cardTitle: string;
  endDate: string;
  loading: boolean = false;
  page: number = 1;
  perPage: number = 10;
  requestAgent: string = "";
  requestDate: string = "";
  requestMethod: string = "";
  selectedAgent: string;
  selectedDate: string;
  selectedMethod: string;
  startDate: string;
  total: number;
  visible: boolean = false;
  visibleDate: boolean = false;
  visibleAgent: boolean = false;

  constructor(
    private _httpService: HttpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
   }

  ngOnInit(): void {
    this.loadData();
    this.cardTitle = `${this.user['firstName']}'s Audit Trail`;
  }

  private fetchAuditTrail(model): void {
    this._httpService.postAudit('api/v1/logs/get', model).subscribe(res => {
      if (res['status'] === 200) {
        this.auditTrails = res['data']['content'];
        this.total = res['data']['totalElements'];
        this.loading = false;
        
      } else {
        this.toastr.error(res.message, "Error!")
      }
    })
  }

  //loads user audit trail
  loadData(): void {
    this.loading = true;
    let email = this.user['email'];
    let model = {
      page: this.page - 1,
      size: this.perPage,
      from: this.startDate,
      to: this.endDate,
      userEmail: email
    };
    if(this.selectedAgent) {
      model["userAgent"] = this.selectedAgent;
    }
    if(this.selectedMethod) {
      model["methodType"] = this.selectedMethod;
    }
    this.fetchAuditTrail(model);
  }

  viewAudit(element): void {
    this.router.navigate(['users/view-audit-trail/', element.id,]);
  }

   //updates request params
   onQueryParamsChange(params: NzTableQueryParams): void {
    const {pageSize, pageIndex} = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadData();
  }

  //loads audit trail by user agent
  onUserAgentSelect(event): void {
    this.selectedAgent = event;
    this.loadData();
  }

  //loads audit trails by request method
  onMethodSelect(event): void {
    this.selectedMethod = event;
    this.loadData();
  }

  //loads audit trail by request date
  onDateSelect(event): void {
    this.startDate = new Date(event[0]).toISOString().slice(0,10);
    this.endDate = new Date(event[1]).toISOString().slice(0,10);
    this.loadData();
  }

  //resets filters
  reset(): void {
    this.requestDate = "";
    this.requestMethod = "";
    this.requestAgent = "";
    this.selectedMethod = "";
    this.selectedDate = "";
    this.selectedAgent = "";
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
    this.loadData();
  }
}
