
import { Component, OnInit } from "@angular/core";
import { AddRolesComponent } from "./add-roles/add-roles.component";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "src/app/shared/services/http.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { DataExportationService } from "src/app/shared/services/data-exportation.service";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  mandatoryColumns: any[] = ["Role Name", "Description", "Status"];
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
  searchRoleName = '';
  searchDescription = '';
  searchStatus: boolean;
  data_loaded: boolean = false;
  loading: boolean = false;
  allStatus: boolean;
  exportTitle: string = '';
  roleColumns: string[];
  roleRows: any[];

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private _dataExportationService: DataExportationService
  ) 
  {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles(){
    this.loading = true;
   this.httpService.get("Roles/GetRolesAll", this.page, this.perPage).subscribe(res => {
     if(res){
       this.loading = false;
     this.listOfData = res['data']['content'];
     this.total = res['data']['totalPages'];
     console.log(this.total)

     this.listOfDisplayData = [...this.listOfData];
     let columns = [];
     this.listOfData.map((item, i) => {
       item.ID = (this.page - 1) * this.perPage + i+1;
       Object.keys(item).map(itemKeys => {
         columns.push(itemKeys);
       })
     });
     this.columnsToExport = Array.from(new Set(columns));
     this.columnsToExport.map(item =>{
       switch(item){
        
         case 'RoleName':
           this.columnsJson['Role Name'] = 'RoleName';
           break;
         case 'Description': 
           this.columnsJson['Description'] = 'Description';
           break;
        case 'isActive':
          this.columnsJson['Status'] = 'isActive';
        
         default: 
         break;
       }
     });
     this.displayColumns = Object.keys(this.columnsJson);
   }
   }
   )
 }

  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
   const {pageSize, pageIndex} = params;
   this.page = pageIndex;
   this.perPage = pageSize;
   this.loadRoles();
 }

 selectedColumns(event):void{
   this.mandatoryColumns = event;
 }


 roleSearch(): void{
   this.visible = false;
   this.listOfDisplayData = this.listOfData.filter((item)=> 
   item.RoleName.toLowerCase().indexOf(this.searchRoleName) !== -1
   );
 }

 descriptionSearch(){
  this.visible = false;
  this.listOfDisplayData = this.listOfData.filter((item)=> 
  item.Description.toLowerCase().indexOf(this.searchDescription) !== -1
  );
 }
 statusSearch(){
  this.visible = false;
  if(this.searchStatus == false){
    this.allStatus = false;
  }
  this.listOfDisplayData = this.listOfData.filter(item=>
    item.IsVisible == this.searchStatus);
}
removeStatusFilter(){
  this.visible = false;
  this.listOfDisplayData = this.listOfData

}

 globalSearch(){
   if(this.searchInput.length < 1){
return this.loadRoles();
   } else{
     this.listOfDisplayData = this.listOfData.filter((item) => {
       return item.RoleName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
       item.Description.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
       item.isActive.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
   })
   }
   
 }

 openRoleDialog(mode: string, dialogData: any) {
  let dialogfRef = this.dialog.open(AddRolesComponent, {
    width: "450px",
    data: {
      data: dialogData,
      mode: mode

    },
  })
  dialogfRef.afterClosed().subscribe(res => {
    this.loadRoles()
  })

}

 //triggers role edit dialog
 editRoleDetails(data: any): void {
   this.editData = true;
   const dialogRef = this.dialog.open(AddRolesComponent, 
     {data: 
       {
         data: data, 
         edit: this.editData
       }, 
       width: '500px', 
       disableClose: true})
   dialogRef.afterClosed().subscribe(() => {
     if (data) {
       this.loadRoles();
     }
   });
 }

  //exports roles to xlsx
  exportRolesXLSX(): void {
    let RolesToExport = [];
    this.listOfData.map(item => {
      if (item["isActive"] == true) {
        item["isActive"] = "Active";
      } else {
        item["isActive"] = "Inactive";
      }
      let container = {};
      this.mandatoryColumns.map(col => {
        container[col] = item[this.columnsJson[col]];
        RolesToExport.push(container);
      })
    });
    let entries = this.getUniqueListBy(RolesToExport, "ID");
    this.exportXLSX(entries, "System Roles");
  }
  private getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  exportXLSX(dataArray, title): void {
    this._dataExportationService.exportDataXlsx(dataArray, title);
  }

  //exports roles to PDF
  exportRolesPDF(): void {
    this.exportTitle = "System Roles.pdf";
    this.roleColumns = this.mandatoryColumns;
    this.roleRows = this.listOfData.map(users => {
      let container = [];
      this.mandatoryColumns.map(col => {
        container.push(users[this.columnsJson[col]]);
      })
      return container;
    })
    this.exportPDF(this.roleColumns, this.roleRows, this.exportTitle);
  }

  exportPDF(cols, rows, title): void {
    this._dataExportationService.exportToPdf(cols, rows, title);
  }
}
