import { Router } from "@angular/router";
import { AddUserDialogComponent } from "./add-user-dialog/add-user-dialog.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "src/app/shared/services/http.service";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { DataExportationService } from "src/app/shared/services/data-exportation.service";


@Component({
  selector: "app-system-users",
  templateUrl: "./system-users.component.html",
  styleUrls: ["./system-users.component.scss"]
})
export class SystemUsersComponent implements OnInit {
  mandatoryColumns: any[] = ["UserName", "Full Name", "Email", "Status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  editData: boolean;
  page: number = 1;
  perPage: number = 10;
  total: number;
  searchValue: string = '';
  visible: boolean = false;
  listOfData: any[] = [];
  listOfDisplayData: any;
  searchInput: string = '';
  searchfullName:string = '';
  searchEmail: string = ''
  data_loaded: boolean = false;
  loading: boolean = false;
  authorized = false;
  exportTitle: string;
  searchStatus: boolean;
  allStatus: boolean;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private _dataExportationService: DataExportationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  openDialog(mode, data) {
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: "800px",
      data: {
        data: data,
        mode: mode
      },
    });

    return dialogRef.afterClosed().toPromise().then(res => {
      this.loadUsers()
    });
  }


  viewUserDetails(data: any) {
    
    localStorage.setItem('user', JSON.stringify(data))
    this.router.navigate(["user-profile/list-users/", data.Id], { skipLocationChange: true });
  }
  editUser(data: any) {
    this.editData = true;
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: "800px",
      data: {
        data: data,
        edit: this.editData
      }
    });
    return dialogRef.afterClosed().toPromise().then(res => {
      this.loadUsers();
    });
}

loadUsers(){
  this.loading = true;
 this.httpService.get("user/all", this.page, this.perPage).subscribe(res => {
   if(res['status'] == 200 || res['status'] == 201){
     this.loading = false;
   this.listOfData = res['data']['content'];
   this.total = res['data']['totalPages'];

   this.listOfData.map((value, i) => {
    let firstname = value.FirstName;
    let middlename = value.MiddleName;
    let lastname = value.LastName;
    value.ID = (this.page - 1) * this.perPage + i+1;
    return value.FullName = firstname + " " + middlename + " " + lastname;
  })

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
      
       case 'UserName':
         this.columnsJson['UserName'] = 'UserName';
         break;
       case 'FullName': 
         this.columnsJson['Full Name'] = 'FullName';
         break;
       case 'Email':
         this.columnsJson['Email'] = 'Email';
         break;
      case 'Active':
        this.columnsJson['Status'] = 'Active';
      
       default: 
       break;
     }
   });
   this.displayColumns = Object.keys(this.columnsJson);
   this.loading=false;
 }
 })
}

//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
 const {pageSize, pageIndex} = params;
 this.page = pageIndex;
 this.perPage = pageSize;
 this.loadUsers();
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
 item.FullName.toLowerCase().indexOf(this.searchValue) !== -1
 );
}

statusSearch(){
  // this.visible = false;
  console.log(this.searchStatus)
  if(this.searchStatus == false){
    this.allStatus = false;
  }
  this.listOfDisplayData = this.listOfData.filter(item=>
    item.Active == this.searchStatus);
}
removeStatusFilter(){
  // this.visible = false;
  this.listOfDisplayData = this.listOfData

}

userNameSearch(){
  if(this.searchValue.length < 1){
    return this.loadUsers();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    return this.loadUsers();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    return this.loadUsers();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
return this.loadUsers();
 } else{
   this.listOfDisplayData = this.listOfData.filter((item) => {
     return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.FullName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.Email.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
     item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
 })
 }
}


      //exports Userss to xlsx
      exportUsersXLSX(): void {
        let UsersToExport = [];
        this.listOfData.map(item => {
          if (item["isActive"] == true) {
            item["isActive"] = "Active";
          } else {
            item["isActive"] = "Inactive";
          }
          let container = {};
          this.mandatoryColumns.map(col => {
            container[col] = item[this.columnsJson[col]];
            UsersToExport.push(container);
          })
        });
        let entries = this.getUniqueListBy(UsersToExport, "ID");
        this.exportXLSX(entries, "System Users");
      }
    
      exportXLSX(dataArray, title): void {
        this._dataExportationService.exportDataXlsx(dataArray, title);
      }
    
      private getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
      }
    
    
            //exports Userss to xlsx
            exportUsersCSV(): void {
              let UsersToExport = [];
              this.listOfData.map(item => {
                if (item["isActive"] == true) {
                  item["isActive"] = "Active";
                } else {
                  item["isActive"] = "Inactive";
                }
                let container = {};
                this.mandatoryColumns.map(col => {
                  container[col] = item[this.columnsJson[col]];
                  UsersToExport.push(container);
                })
              });
              let entries = this.getUniqueListBy(UsersToExport, "ID");
              this.exportToCSV(entries, "Users-list");
            }
          
            exportToCSV(dataArray, title): void {
              this._dataExportationService.exportDataXlsx(dataArray, title);
            }
    
    
          //exports Userss to PDF
      exportUsersPDF(): void {
        this.exportTitle = "System-users.pdf";
        this.usersColumns = this.mandatoryColumns;
        this.usersRows = this.listOfData.map(users => {
          let container = [];
          this.mandatoryColumns.map(col => {
            container.push(users[this.columnsJson[col]]);
          })
          return container;
        })
        this.exportPDF(this.usersColumns, this.usersRows, this.exportTitle);
      }
    
      exportPDF(cols, rows, title): void {
        this._dataExportationService.exportToPdf(cols, rows, title);
      }
    

}
