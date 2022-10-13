import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DataExportationService } from 'src/app/shared/services/data-exportation.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddProductComponent } from '../add-product/add-product.component';

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  displayedColumns: string[] = ['Position','ID','PRODUCT_CODE','DESCRIPTION','BRAND','PACK','PACKAGING_TYPE','CREATED_BY','REMARKS','ACTIONS'];
  
  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  mandatoryColumns: any[] = ["productCode","productDescription", "brand", "pack", "packagingType", "remarks", "createdBy"];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  editData: boolean;
  updateProduct: boolean;
  productDetails: any;
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
  showHideDetails: boolean = true;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  //opens creation modal
  triggerModal(data: any): void {
    this.editData = false;
    this.productDetails = data;
    const dialogRef = this.dialog.open(AddProductComponent, {data: {data: this.productDetails, updateProduct: this.updateProduct}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadProducts();
    })
  }

  //open order update modal
  edit(data: any): void {
    this.productDetails = data;
    this.updateProduct = true;
    const dialogRef = this.dialog.open(AddProductComponent, {data: {data: this.productDetails, updateProduct: this.updateProduct}, height: '570px', width: '570px', disableClose: true});
    dialogRef.afterClosed().subscribe(() => {
      this.loadProducts();
    })
  }

  // Delete Confirmation Dialog
  delete() {
    const dialogRef = this.dialog.open(DialogComponent,{
      data:{
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });
    const snack = this.snackBar;

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        snack.dismiss();
        const a = document.createElement('a');
        a.click();
        a.remove();
        snack.dismiss();
        this.snackBar.open('Data deleted successfully', 'Eclectics International', {
          duration: 2000,
        });
      }
    });
  }


  viewUserDetails(data: any) {
    
    localStorage.setItem('user', JSON.stringify(data))
    this.router.navigate(["user-profile/list-users/", data.Id], { skipLocationChange: true });
  }

loadProducts(){
  this.loading = true;
 this.httpService.get("config/product/all", this.page, this.perPage).subscribe(res => {
   if(res['responseCode'] == 200 || res['responseCode'] == 201){
     this.loading = false;
   this.listOfData = res['data'];
   console.log('Products');
   console.log(this.listOfData);

   // @ts-ignore
   this.dataSource= new MatTableDataSource(this.listOfData);
   this.dataSource.paginator = this.paginator
   this.dataSource.sort = this.sort
   this.total = res['totalCount'];

   this.listOfData.map((value, i) => {
    
    value.ID = (this.page - 1) * this.perPage + i+1;
  });

   this.listOfDisplayData = [...this.listOfData];
   let columns = [];
   this.listOfData.map(item => {
     Object.keys(item).map(itemKeys => {
       columns.push(itemKeys);
     });
   });
   this.columnsToExport = Array.from(new Set(columns));
   this.columnsToExport.map(item =>{
     switch(item){
      
       case 'productCode':
         this.columnsJson['productCode'] = 'productCode';
         break;
       case 'productDescription': 
         this.columnsJson['productDescription'] = 'productDescription';
         break;
       case 'brand':
         this.columnsJson['brand'] = 'brand';
         break;
      case 'pack':
        this.columnsJson['pack'] = 'pack';
        break;
        case 'packagingType': 
        this.columnsJson['packagingType'] = 'packagingType';
        break;
       default: 
       break;
     }
   });
   this.displayColumns = Object.keys(this.columnsJson);
   this.loading=false;
 }
 });
}

//updates request body
onQueryParamsChange(params: NzTableQueryParams): void {
 const {pageSize, pageIndex} = params;
 this.page = pageIndex;
 this.perPage = pageSize;
 this.loadProducts();
}


removeStatusFilter(){
  // this.visible = false;
  this.listOfDisplayData = this.listOfData

}

// Search/Filter
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLocaleLowerCase()

 if(this.dataSource.paginator){
   this.dataSource.paginator.firstPage()
 }
}

columnDefinitions = [
  { def: 'Position', label: 'Position', },
  { def: 'ID', label: 'ID', },
  { def: 'PRODUCT_CODE', label: 'PRODUCT_CODE', },
  { def: 'DESCRIPTION', label: 'DESCRIPTION', },
  { def: 'BRAND', label: 'BRAND', },
  { def: 'PACK', label: 'PACK', },
  { def: 'PACKAGING_TYPE', label: 'PACKAGING_TYPE', },
  { def: 'CREATED_BY', label: 'CREATED_BY', },
  { def: 'REMARKS', label: 'REMARKS', },
]

show_hide_details() {

  this.showHideDetails= !this.showHideDetails;
  }

  // Download PDF
  exportProductPDF() {
    var prepare=[];
    this.listOfData.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.ID);
      tempObj.push(e.productCode);
      tempObj.push(e.productDescription);
      tempObj.push(e.brand);
      tempObj.push( e.pack);
      tempObj.push(e.packagingType);
      tempObj.push(e.createdBy);
      tempObj.push(e.remarks);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('l', 'mm', 'a4',);
    var fontSize = 12; 
    var imageUrl = "./assets/images/iko-stock-logo.png";
    doc.setFontSize(fontSize);
    doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
    doc.text("PRODUCT LIST",  128, 48,);
    autoTable(doc, {
        head: [['#','PRODUCT CODE','DESCRIPTION','BRAND','PACK','PACKAGING TYPE','CREATED BY','REMARKS']],
        margin: {  top: 5, horizontal: 5, bottom: 2, vertical: 5},
        body: prepare,
        startY: 60,
        theme: 'striped',
        headStyles :{minCellHeight: 12, textColor: [255,255,255],fontStyle: "bold", fontSize: 10},
        foot: [['','', '','@Eclectics International',' ','','',]],
        footStyles :{textColor: [255,255,255],font: "rotobo", fontSize: 10},
        bodyStyles: {minCellHeight: 10, fontSize: 9.5}
    });

    doc.save('Product_List' + '.pdf');
  }

}
