import { AddProfilesDialogComponent } from './add-profiles-dialog/add-profiles-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { HttpService } from 'src/app/shared/services/http.service';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DataExportationService } from 'src/app/shared/services/data-exportation.service';

@Component({
  selector: "app-profiles",
  templateUrl: "./profiles.component.html",
  styleUrls: ["./profiles.component.scss"],
  providers: [DatePipe]
})
export class ProfilesComponent implements OnInit {
  mandatoryColumns: any[] = ["Profile Name", "Description", "Status"];
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
  searchProfile = '';
  searchDescription = '';
  searchStatus: boolean = false;
  allStatus: boolean;
  data_loaded: boolean = false;
  loading: boolean = false;
  dialogRef: any;
  profileColumns: string[];
  profileRows: any[];
  exportTitle: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private httpService: HttpService,
    private _dataExportationService: DataExportationService
  ) { }

  ngOnInit() {
    this.loadProfiles();
  }

  viewProfile(data: any): void {
    localStorage.setItem('profile_details', JSON.stringify(data))
    this.router.navigate(["user-profile/profile/view/", data.ProfileId])
    // { skipLocationChange: true }
    // )

  }
  openDialog(mode: string, data: any) {
    this.dialogRef = this.dialog.open(AddProfilesDialogComponent, {
      width: "400px",
      data: {
        data: data,
        mode: mode
      }
    })

    this.dialogRef.afterClosed().subscribe(result => {
      result
      this.loadProfiles()
    })
  }
  editProfileDetails(data: any): void {
    this.editData = true;
    this.dialogRef = this.dialog.open(AddProfilesDialogComponent,
      {
        width: "400px",
        data: {
          data: data,
          edit: this.editData
        },
        disableClose: true
      });

    this.dialogRef.afterClosed().subscribe(() => {
      if (data) {
        return this.loadProfiles();
      }
    });
  }


  loadProfiles() {
    this.loading = true;
    this.httpService.get("Profiles", this.page, this.perPage).subscribe(res => {
      if (res['status'] == 200 || res['status'] == 201) {
        this.loading = false;
        this.listOfData = res['data']['content'];
        this.total = res['data']['totalPages'];

        this.listOfDisplayData = [...this.listOfData];
        let columns = [];
        this.listOfData.map(item => {
          Object.keys(item).map(itemKeys => {
            columns.push(itemKeys);
          })
        });
        this.columnsToExport = Array.from(new Set(columns));
        this.columnsToExport.map(item => {
          switch (item) {
            case 'ProfileName':
              this.columnsJson['Profile Name'] = 'ProfileName';
              break;
            case 'Remarks':
              this.columnsJson['Description'] = 'Remarks';
              break;
            case 'IsVisible':
              this.columnsJson['Status'] = 'IsVisible';
              break;
            default:
              break;
          }
        });
        this.displayColumns = Object.keys(this.columnsJson);
      }
    },
    err => {
      this.loading = false;
      this.httpService.getError(err);
    })
  }

  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadProfiles();
  }

  selectedColumns(event): void {
    this.mandatoryColumns = event;
  }

  profileSearch(){
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter(item=>
      item.ProfileName.toLowerCase().indexOf(this.searchProfile) !== -1);
  }
  descriptionSearch(){
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter(item=>
      item.Remarks.toLowerCase().indexOf(this.searchDescription) !== -1);
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

  globalSearch() {
    if (this.searchInput.length < 1) {
      return this.loadProfiles();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) => {
        return item.ProfileName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.Remarks.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.IsVisible.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
      })
    }
  }

  //exports Userss to xlsx
  exportProfilesXLSX(): void {
    let ProfilesToExport = [];
    this.listOfData.map(item => {
      if (item["isActive"] == true) {
        item["isActive"] = "Active";
      } else {
        item["isActive"] = "Inactive";
      }
      let container = {};
      this.mandatoryColumns.map(col => {
        container[col] = item[this.columnsJson[col]];
        ProfilesToExport.push(container);
      })
    });
    let entries = this.getUniqueListBy(ProfilesToExport, "ID");
    this.exportXLSX(entries, "System Profiles");
  }
  private getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  exportXLSX(dataArray, title): void {
    this._dataExportationService.exportDataXlsx(dataArray, title);
  }

  //exports Userss to PDF
  exportProfilesPDF(): void {
    this.exportTitle = "System Profiles.pdf";
    this.profileColumns = this.mandatoryColumns;
    this.profileRows = this.listOfData.map(users => {
      let container = [];
      this.mandatoryColumns.map(col => {
        container.push(users[this.columnsJson[col]]);
      })
      return container;
    })
    this.exportPDF(this.profileColumns, this.profileRows, this.exportTitle);
  }

  exportPDF(cols, rows, title): void {
    this._dataExportationService.exportToPdf(cols, rows, title);
  }

}
