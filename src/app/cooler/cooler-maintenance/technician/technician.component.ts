import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss']
})
export class TechnicianComponent implements OnInit {


  mandatoryColumns: any[] = ["UserName", "Full Name", "Email", "Status"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  editData: boolean;
  page: number = 0;
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
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  // openDialog(mode, data) {
  //   let dialogRef = this.dialog.open(AddUserDialogComponent, {
  //     width: "800px",
  //     data: {
  //       data: data,
  //       mode: mode
  //     },
  //   });

  //   return dialogRef.afterClosed().toPromise().then(res => {
  //     this.loadProducts()
  //   });
  // }


  viewUserDetails(data: any) {
    
    localStorage.setItem('user', JSON.stringify(data))
    this.router.navigate(["user-profile/list-users/", data.Id], { skipLocationChange: true });
  }
//   editUser(data: any) {
//     this.editData = true;
//     let dialogRef = this.dialog.open(AddUserDialogComponent, {
//       width: "800px",
//       data: {
//         data: data,
//         edit: this.editData
//       }
//     });
//     return dialogRef.afterClosed().toPromise().then(res => {
//       this.loadProducts();
//     });
// }

loadProducts(){
  this.loading = true;
 this.httpService.get("config/product/all", this.page, this.perPage).subscribe(res => {
   if(res['status'] == 200 || res['status'] == 201){
     this.loading = false;
   this.listOfData = res['data']['content'];
   console.log('Products');
   console.log(this.listOfData)
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
 this.loadProducts();
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
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
    );
  }
}
emailSearch(){
  if(this.searchEmail.length < 1){
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
    );
  }
}
fullnameSearch(){
  if(this.searchfullName.length < 1){
    return this.loadProducts();
  } else {
    this.listOfDisplayData = this.listOfData.filter((item)=>
      item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
    );
  }
}

globalSearch(){
 if(this.searchInput.length < 1){
return this.loadProducts();
 } else{
   this.listOfDisplayData = this.listOfData.filter((item) => {
     return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.FullName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
     item.Email.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) || 
     item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
 })
 }
}

}
