
import { ViewAuditTrailComponent } from './../view-audit-trail/view-audit-trail.component';
import { Component, OnInit, Input } from '@angular/core';
import {  NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/shared/services/http.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-audit-trail-list',
  templateUrl: './audit-trail-list.component.html',
  styleUrls: ['./audit-trail-list.component.scss']
  // providers: [DatePipe]
})
export class AuditTrailListComponent implements OnInit {
  mandatoryColumns: any[] = ["Method", "IP", "Time", "URL", "Request Status", "Response", "User A/C", "User Agent"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  editData: boolean;
  page: number = 1;
  perPage: number = 10;
  total: number;
  searchValue = '';
  visible = false;
  listOfData: any;
  listOfDisplayData: any;
  searchInput = '';
  data_loaded: boolean = false;
  loading: boolean = false;


  @Input() data;
  public formData;
  public modalRef: NgbModalRef;

  dataSet: any;
  request_body: any;
  user: any;

  constructor(
    private _httpService: HttpService, 
    public toastrService: ToastrService, 
    private dialogService: MatDialog

  ) {
    this.user = JSON.parse(localStorage.getItem('user'))
  }
  ngOnInit() {
    this.getAuditTrail();
  }

  // public onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     this._httpService.delete('profile/' + event.data.id).subscribe(
  //       result => {
  //         if (result.response_code === 200) {
  //           event.confirm.resolve();
  //           this.toastrService.success(event.data.id, 'Deleted!');
  //         } else {
  //           this.toastrService.error(event.data.id, 'Failed to Delete!');
  //         }
  //       }
  //     );
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
  public viewRecord(formData: any) {
    let modalRef = this.dialogService.open(ViewAuditTrailComponent, {
      width: '700px',
      data: formData
    });

    modalRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
      }
    }, (reason) => {
      reason
    });
  }



  getAuditTrail(){
    this.loading = true;
   this._httpService.get("AuditTrail", this.page, this.perPage).subscribe(res => {
     if(res){
       this.loading = false;
     this.listOfData = res['data']['content'];
     this.total = res['data']['totalElements'];

     this.listOfDisplayData = [...this.listOfData];
     let columns = [];
     this.listOfData.map(item => {
       Object.keys(item).map(itemKeys => {
         columns.push(itemKeys);
       })
     });
     this.columnsToExport = Array.from(new Set(columns));
     this.columnsToExport.map(item =>{
       switch(item){
        
         case 'name':
           this.columnsJson['Workflow Name'] = 'name';
           break;
         case 'CategoryName': 
           this.columnsJson['Process Category'] = 'CategoryName';
           break;
         case 'process_code':
           this.columnsJson['Process Code'] = 'process_code';
           break;
        case 'is_active':
          this.columnsJson['Status'] = 'is_active';
        
         default: 
         break;
       }
     });
     this.displayColumns = Object.keys(this.columnsJson);
     console.log('display columns', this.displayColumns);
   }
   }, err=> {
     this.loading = false;
     this._httpService.getError(err);
   }
   )
 }

  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
   const {pageSize, pageIndex} = params;
   this.page = pageIndex;
   this.perPage = pageSize;
   this.getAuditTrail();
 }

 selectedColumns(event):void{
   this.mandatoryColumns = event;
 }
 reset(): void{
   this.searchValue = '';
   this.search();
 }

 search(): void{
   this.visible = false;
   this.listOfDisplayData = this.listOfData.filter((item)=> 
   item.name.toLowerCase().indexOf(this.searchValue) !== -1
   );
 }

 globalSearch(){
   if(this.searchInput.length < 1){
return this.getAuditTrail();
   } else{
     this.listOfDisplayData = this.listOfData.filter((item) => {
       return item.name.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
       item.CategoryName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
       item.process_code.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
       item.is_active.toString().loLocaleLowerCase().match(this.searchInput.toLowerCase())
   })
   }
   
 }

 exportToCsvFile(){}
 exportXlsx(){}
 exportPdf(){}


 //triggers bank edit dialog
 editAuditDetails(data: any): void {
   this.editData = true;
   const dialogRef = this.dialogService.open(ViewAuditTrailComponent, 
     {data: 
       {
         data: data, 
         edit: this.editData
       }, 
       width: '500px', 
       disableClose: true});

   dialogRef.afterClosed().subscribe(() => {
     if (data) {
       this.getAuditTrail();
     }
   });
 }
}
