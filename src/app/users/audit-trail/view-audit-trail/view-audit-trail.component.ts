import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-view-audit-trail',
  templateUrl: './view-audit-trail.component.html',
  styleUrls: ['./view-audit-trail.component.scss']
})
export class ViewAuditTrailComponent implements OnInit {

  @Input () lAuditTrail;
  auditTrail: any;
  auditTrails: any[];
  accessValidated: boolean = false;
  endDate: string;
  loading: boolean = false;
  page: number = 1;
  perPage: number = 10;
  requestBody: any;
  responseBody: any;
  startDate: string;

  constructor(
    private _httpService: HttpService,
    private route: ActivatedRoute
  ) {
    let today = new Date;
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-13).toISOString().slice(0,10);
    this.endDate = new Date().toISOString().slice(0,10);
   }

  ngOnInit(): void {
    this.loadTrails();
  }

  //retrieves audit trail details
  loadTrails(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    let model = {
     id: id
    };
    this._httpService.postAudit("api/v1/logs/audit-logs-by-id", model).subscribe(res => {
      if (res["status"] == 200) {
        this.auditTrail = res["data"];
        if (typeof(this.auditTrail["responseBody"]) == "string") {
          this.responseBody = JSON.parse(this.auditTrail["responseBody"]);
        } else {
          this.responseBody = this.auditTrail["responseBody"];
        };
        if (typeof(this.auditTrail["requestBody"]) == "string") {
          this.requestBody = JSON.parse(this.auditTrail["requestBody"]);
        } else {
          this.requestBody = this.auditTrail["requestBody"];
        }
        let roles = JSON.parse(localStorage.getItem("userRoles"));
        this.accessValidated = roles.includes("View Audit Trail Body");
      }
    })
  }

}
