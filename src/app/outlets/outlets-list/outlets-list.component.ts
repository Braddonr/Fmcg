import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/shared/services/http.service';
import { AddOutletComponent } from '../add-outlet/add-outlet.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { Element } from '@angular/compiler';
import { Outletdata } from '../outletdata';
import { endOfMonth } from 'date-fns';
import * as XLSX from "xlsx";
import { GlobalService } from 'src/app/shared/services/global.service';
import jspdf from 'jspdf';
import { Loader } from '@googlemaps/js-api-loader';
import { MouseEvent } from '@agm/core';
import reverseGeocode from 'angular-reverse-geocode';

// import jsPDF from '../../node_modules/jspdf/dist/jspdf.umd.min.js'



@Component({
  selector: 'app-outlets-list',
  templateUrl: './outlets-list.component.html',
  styleUrls: ['./outlets-list.component.scss'],
  styles: [`
    agm-map {
      height: 240px;
      padding-top: 2px;
    }
  `],
   encapsulation: ViewEncapsulation.None,
})
export class OutletsListComponent implements OnInit {

  displayedColumns: string[] = ['Position', 'ID', 'NAME', 'CODE', 'CREDIT_NAME', 'TYPE', 'OUTLET_ROUTE', 'LOCATION', 'CONTACT_NAME', 'CONTACT_PHONE', 'LATITUDE', 'LONGITUDE', 'CREDIT_CODE', 'CREATED_BY', 'CREATED_ON', 'REMARKS', 'ACTIONS'];

  public dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('outletTable', { static: false }) el!: ElementRef;
  // @ViewChild('map', { static: false }) map: ElementRef;

  //define tool tip properties
  @Input() toolTipViewTitle: string = "View";
  @Input() toolTipViewColor: string = "blue";
  @Input() toolTipViewPosition = 'bottom';

  @Input() toolTipEditTitle: string = "Edit";
  @Input() toolTipEditColor: string = "";
  @Input() toolTipEditPosition = 'bottom';

  @Input() toolTipDeleteTitle: string = "Delete";
  @Input() toolTipDeleteColor: string = "red";
  @Input() toolTipDeletePosition = 'bottom';

  // @ViewChild(MatSort) sort: MatSort


  mandatoryColumns: any[] = [
    "outletName",
    "location",
    // "longitude",
    // "latitude",
    "createdBy",
    "createdOn",
    // "idNumber",
    "contactMobileNumber",
    "contactName",
    "cdCode",
    "cdName",
    // "outletCode",
    "outletType",
    "outletRoute",
    // "remarks"
  ];

  showHides: any[] = ['outletName', 'outletCode', 'outletType', 'outletRoute', 'location', 'latitude', 'longitude', 'cdName', 'cdCode', 'cdEmail', 'cdContactFullName', 'cdOfficePhoneNumber', 'contactName', 'contactMobileNumber', 'remarks'];
  columnsJson: any = {};
  columnsToExport: string[] = [];
  displayColumns: any[];
  usersColumns: string[];
  usersRows: any[];
  updateOutlet: boolean;
  outletDetails: any;
  page: number = 1;
  perPage: number = 10;
  total: number = 1;
  searchValue: string = '';
  visible1: boolean = false;
  visible2: boolean = false;
  visible3: boolean = false;
  visible4: boolean = false;
  visible5: boolean = false;
  visible6: boolean = false;
  visible7: boolean = false;
  visible8: boolean = false;
  ranges = { Today: [new Date(), new Date()], 'This Month': [new Date(), endOfMonth(new Date())] };

  // listOfData$ : Observable<listofData[]>;
  listOfData: any[] = [];
  outletTypes: any[] = [];
  listOfDisplayData: any;
  searchInput: string = '';
  searchfullName: string = '';
  searchEmail: string = ''
  data_loaded: boolean = false;
  loading: boolean = false;
  authorized = false;
  exportTitle: string;
  searchStatus: boolean;
  allStatus: boolean;
  showHideAll: boolean = true;
  showHideID: boolean = false;
  showHideCode: boolean = true;
  showHideCdCode: boolean = true;
  showHideLatitude: boolean = false;
  showHideLongitude: boolean = false;
  showHideRemarks: boolean = false;
  showHideOutletName: boolean = true;
  showHideCreditName: boolean = false;
  showHideType: boolean = true;
  showHideOutletRoute: boolean = false;
  showHideLocation: boolean = true;
  showHideContactName: boolean = false;
  showHideContactPhone: boolean = false;
  showHideCreatedBy: boolean = false;
  showHideCreatedOn: boolean = true;
  showHideActions: boolean = true;
  checked: boolean = true;


  showAll = false;
  id = false;
  outletName = true;
  outletCode = true;
  creditName = false;
  type = true;
  outletRoute = false;
  location = true;
  contactName = false;
  contactPhone = false;
  cdCode = true;
  latitude = false;
  longitude = false;
  createdBy = false;
  createdOn = true;
  actions = true;
  remarks = false;

  checkList: any[] = [
    { name: 'id', status: false },
    { name: 'outletName', status: true },
    { name: 'outletCode', status: true },
    { name: 'cdName', status: false },
    { name: 'outletType', status: true },
    { name: 'outletRoute', status: false },
    { name: 'location', status: true },
    { name: 'contactName', status: false },
    { name: 'contactMobileNumber', status: false },
    { name: 'cdCode', status: true },
    { name: 'latitude', status: false },
    { name: 'longitude', status: false },
    { name: 'createdBy', status: false },
    { name: 'createdOn', status: true },
    { name: 'actions', status: true },
    { name: 'remarks', status: false },
  ]
  isVisible = false;

  isVisibleEdit = false;
  isVisibleAdd = false;

  outlet: any;
  routes: any;
  formAdd: FormGroup;
  formEdit: FormGroup;
  routeNames = [];
  routeIds = [];

  name: 'Angular';

  searchTerm = '';
  listOfDataToDisplay: any = [];
  sortName = null;
  sortValue = null;

  editData: boolean;
  modalTitle: string;
  excelFileName: string = "Outlets.xlsx";

  display: any;

  // lat: number = -1.286389;
  // lng: number = 36.817223;

  latLng: any;
  marker: any[] = [{
    latitude : '',
    longitude : ''
  }];
  address: any;
  
  // geocoder:any;

  public tableWidth !: number;
  @ViewChild('tableContainer') private readonly _tableContainer!: ElementRef;
  // @ViewChild('map') mapElement: any;
  // map: google.maps.Map;
   totalOutlets: any;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private httpService: HttpService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private modal: NzModalService,
    private toastr: ToastrService,
    private global: GlobalService,
    

  ) { }

  // public ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.tableWidth = (this._tableContainer.nativeElement as HTMLImageElement).clientHeight - 2100; // X depend of your page display
  //   });
  // }

  ngOnInit() {

    //  let loader = new Loader({
    //   apiKey: "AIzaSyAYUjnwM5-VT-2eF20lGCU-xEMqEbJ6X5Q"
    //  })
     
    //  loader.load().then(() => {
    //   new google.maps.Map(document.getElementById("map"),
    //   {center: {lat: 51.233334, lng: 6.78333},
    //   zoom: 14,
    //   styles: [ 
    //     ]
    //   })
    //  })
  
    // this.formEdit = this.formBuilder.group
    // ({ 
    //   outletName:[this.outlet ? this.outlet['outletName']: '', Validators.compose([Validators.required])],
    //   outletCode:[this.outlet ? this.outlet['outletCode']: '', Validators.compose([Validators.required])],
    //   outletType:[this.outlet ? this.outlet['outletType']: '', Validators.compose([Validators.required])],
    //   outletRoute:[this.outlet ? this.outlet['outletRoute']: '', Validators.compose([Validators.required])],
    //   location:[this.outlet ? this.outlet['location']: '', Validators.compose([Validators.required])],
    //   // latitude:[this.outlet ? this.outlet['latitude']: '', Validators.compose([Validators.required])],
    //   // longitude:[this.outlet ? this.outlet['longitude']: '', Validators.compose([Validators.required])],
    //   cdName:[this.outlet ? this.outlet['cdName']: '', Validators.compose([Validators.required])],
    //   cdCode:[this.outlet ? this.outlet['cdCode']: '', Validators.compose([Validators.required])],
    //   cdEmail:[this.outlet ? this.outlet['cdEmail']: '', Validators.compose([Validators.required])],
    //   cdContactFullName:[this.outlet ? this.outlet['cdContactFullName']: '', Validators.compose([Validators.required])],
    //   cdOfficePhoneNumber:[this.outlet ? this.outlet['cdOfficePhoneNumber']: '', Validators.compose([Validators.required])],
    //   contactName:[this.outlet ? this.outlet['contactName']: '', Validators.compose([Validators.required])],
    //   contactMobileNumber:[this.outlet ? this.outlet['contactMobileNumber']: '', Validators.compose([Validators.required])],
    //   remarks: [this.outlet ? this.outlet['remarks']: '', Validators.compose([Validators.required])]
    //    });
    
    this.latLng = {
      latitude: -1.286389,
      longitude: 36.817223
    }

    // this.geocoder = require('local-reverse-geocoder');

    this.formAdd = new FormGroup({
      outletName: new FormControl('', [<any>Validators.required]),
      outletCode: new FormControl('', [<any>Validators.required]),
      outletType: new FormControl('', [<any>Validators.required]),
      outletRoute: new FormControl('', [<any>Validators.required]),
      location: new FormControl('', [<any>Validators.required]),
      cdName: new FormControl('', [<any>Validators.required]),
      cdCode: new FormControl('', [<any>Validators.required]),
      cdEmail: new FormControl('', [<any>Validators.required]),
      cdContactFullName: new FormControl('', [<any>Validators.required]),
      cdOfficePhoneNumber: new FormControl('', [<any>Validators.required]),
      contactName: new FormControl('', [<any>Validators.required]),
      contactMobileNumber: new FormControl('', [<any>Validators.required]),
      remarks: new FormControl('', [<any>Validators.required]),
    });

    this.loadOutlets();
  }
  

  addMarker($event: MouseEvent) {

    console.log(`latitude: ${$event.coords.lat}, longitude: ${$event.coords.lng}`);
    this.marker = [{
      latitude: $event.coords.lat,
      longitude: $event.coords.lng
     }]
    // console.log(this.marker[0].latitude)
    this.reverseGeoCoder();
  }

  reverseGeoCoder(){

  //   var point = { latitude: 42.083333, longitude: 3.1 };
  //   this.geocoder.lookUp(point, function (err, res) {
  //     console.log(JSON.stringify(res, null, 2));
  //  });

    // var latlng = new google.maps.LatLng(lat, lng);
    // lat = this.marker[0].latitude;
    // lng = this.marker[0].longitude;
    
    // // This is making the Geocode request
    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ location: latlng }, function (results, status) {
    //     if (status !== google.maps.GeocoderStatus.OK) {
    //         alert(status);
    //     }
    //     // This is checking to see if the GeoCode Status is OK before proceeding
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         console.log(results);
    //         var address = (results[0].formatted_address);
    //     }
    // });

    //use Geoapify Reverse Geocoding API
    let apiKey = '1d8ddf66b4c84277be6a0adfac41a613';
    let lat = this.marker[0].latitude;
    let lon= this.marker[0].longitude;
    this.httpService.reverseGeoCoder(apiKey,lat, lon).subscribe(res => {
      
      this.address = res['features'][0]['properties']
      console.log(this.address)
      console.log(this.address.address_line1)
      // this.location = this.address.address_line1;
      this.formAdd.patchValue({
        location: this.address.address_line1
      });
      this.formEdit.patchValue({
        location: this.address.address_line1
      });
      // this.formAdd = this.formBuilder.group(location);
      });
    }

 
  //open nzAddModal 
  showModalAdd(): void {
    this.isVisibleAdd = true;
    this.loadRoutes();
  }

  handleOkAdd(): void {
    this.addNewOutlet();
    console.log('Button ok clicked!');
    this.isVisibleAdd = false;
  }

  handleCancelAdd(): void {
    console.log('Button cancel clicked!');
    this.isVisibleAdd = false;
  }

  //       //open nzEditModal 
  showModalEdit(element): void {
    this.loadRoutes();
    this.outlet = element;
    this.formEdit = this.formBuilder.group(this.outlet);
    this.isVisibleEdit = true;
    console.log(this.outlet)
  }

  handleOkEdit(): void {
    this.editOutlet();
    console.log('Button ok clicked!');
    this.isVisibleEdit = false;
  }

  handleCancelEdit(): void {
    console.log('Button cancel clicked!');
    this.isVisibleEdit = false;
  }



  //open delete confirmation modal

  showDeleteConfirm(element): void {
    this.modal.confirm({
      nzTitle: 'Delete outlet',
      nzContent: '<p style="color: red;">Are you sure you want to delete this outlet?</p>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(element),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  //opens creation modal
  triggerModal(data: any): void {
    this.updateOutlet = false;
    this.outletDetails = data;
    const dialogRef = this.dialog.open(AddOutletComponent, { data: { data: this.outletDetails, updateOutlet: this.updateOutlet }, height: '570px', width: '570px', disableClose: true });
    dialogRef.afterClosed().subscribe(() => {
      //console.log("form data: ", data);
      this.loadOutlets();

    })
  }

  //Add outlet

  addNewOutlet() {
    this.httpService.post("outlet/new", this.formAdd.value)
      .subscribe({
        next: (res) => {
          this.toastr.success("Outlet details added, awaiting approval", "Success!");
          this.formAdd.reset();
        },
        error: () => {
          this.toastr.error("Outlet details were not added", "Error!");
        },
      })
  }

  //edit outlet
  editOutlet(): void {
    const model = {
      id: this.outlet['id'],
      outletName: this.formEdit.value.outletName,
      outletCode: this.formEdit.value.outletCode,
      outletType: this.formEdit.value.outletType,
      outletRoute: this.formEdit.value.outletRoute,
      location: this.formEdit.value.location,
      // latitude: this.formEdit.value.latitude,
      // longitude: this.formEdit.value.longitude,
      cdName: this.formEdit.value.cdName,
      cdCode: this.formEdit.value.cdCode,
      contactMobileNumber: this.formEdit.value.contactMobileNumber,
      remarks: this.formEdit.value.remarks,

      previousData: {
        id: this.outlet['id'],
        outletName: this.outlet["outletName"],
        outletCode: this.outlet["outletCode"],
        outletType: this.outlet["outletType"],
        outletRoute: this.outlet["outletRoute"],
        location: this.outlet["location"],
        // latitude: this.outlet["latitude"],
        // longitude: this.outlet["longitude"],
        cdName: this.outlet["cdName"],
        cdCode: this.outlet["cdCode"],
        contactMobileNumber: this.outlet['contactMobileNumber'],
        remarks: this.outlet['remarks']
      }
    };


    this.httpService.put("outlet/edit-outlet", model).subscribe(res => {
      console.log(res);

      if (res['status'] === "Success") {
        if (res["message"] = "Edited distributor successfully") {
          this.toastr.success("Outlet details updated", "Success!");
          this.loadOutlets();
        }
        else {
          this.toastr.success("Outlet details updated,", "Success!");
          this.loadOutlets();
        }
      }
      else {
        this.toastr.error("Outlet details were not updated", "Error!");
      }
    })
    
  }


  //open outlet update modal
  // edit(data: any): void {
  //   this.outletDetails = data;
  //   this.updateOutlet = true;
  //   console.log(this.outletDetails)
  //   const dialogRef = this.dialog.open(AddOutletComponent, { data: { data: this.outletDetails, updateOutlet: this.updateOutlet }, height: '570px', width: '570px', disableClose: true });
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.loadOutlets();
  //   })
  // }

  //navigates to single user view
  view(element): void {
    this.router.navigate(['/outlets/view-outlets', element.id]);
  }

  delete(element): void {
    // const dialogRef = this.dialog.open(DialogComponent,{
    //   data:{
    //     message: 'Are you sure want to delete?',
    //     buttonText: {
    //       ok: 'Yes',
    //       cancel: 'No'
    //     }
    //   }
    // });
    const snack = this.snackBar;

    // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    //   if (confirmed) {
    //     console.log(element.id)
    //     // snack.dismiss();
    this.loading = true;
    this.httpService.delete("outlet/delete-outlet", element.id)
      .subscribe({
        next: (res) => {
          console.log(res)
          const a = document.createElement('a');
          a.click();
          a.remove();
          snack.dismiss();
          this.loading= false;
          this.snackBar.open('Data deleted successfully', 'Eclectics International', {
            duration: 2000,
          });
          this.loadOutlets();
        },
        error: () => {
          this.snackBar.open('Error deleting data', 'Eclectics International', {
            duration: 2000,
          });
          this.loading= false;
        }
      })
  }


  viewOutletDetails(element) {

    localStorage.setItem('listOfData', JSON.stringify(element))
    this.router.navigate(["outlets/view-outlets", element.id], { skipLocationChange: true });
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
  //       this.loadOutlets();
  //     });
  // }

  loadOutlets() {
    this.loading = true;
    this.httpService.get("outlet/all", this.page, this.perPage).subscribe(res => {
      if (res['responseCode'] == 200 || res['responseCode'] == 0) {
        this.loading = false;
        this.listOfData = res['data'];
        this.totalOutlets = res['totalCount'];
        console.log(this.totalOutlets)

        this.listOfDataToDisplay = [...this.listOfData];

        this.listOfData.map((x: any) => {
          this.outletTypes.push(x.outletType)
        })

        console.log(this.listOfData)
        console.log(this.outletTypes)

        // @ts-ignore
        this.dataSource = new MatTableDataSource(this.listOfData);
        this.dataSource.paginator = this.paginator
        //  this.dataSource.sort = this.sort
        this.total = res['totalCount'];

        this.listOfData.map((value, i) => {

          value.ID = (this.page) * this.perPage + i + 1;
        })

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
        this.loading = false;
      }
    });
  }

  //load routes names and types to be used in modal
  loadRoutes() {
    this.httpService.getData("outlet/routes")
      .subscribe(res => {
        this.routes = res['data']
        this.routes.map((x: any) => {
          this.routeNames.push(x.routeName)
        })

        console.log(this.routeNames)

        this.routes.map((x: any) => {
          this.routeIds.push(x.id)
        })
        console.log(this.routeIds)
      });
  }



  //updates request body
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.page = pageIndex;
    this.perPage = pageSize;
    this.loadOutlets();
  }

  selectedColumns(event): void {
    this.mandatoryColumns = event;
  }

  //implement search on every column in nztable

  searchCdName(event: Event) {
    // this.visible = false;
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    console.log(searchTerm)
    this.listOfDataToDisplay = this.listOfData.filter((item: Outletdata) => item.cdName.toString().toLowerCase().indexOf(this.searchTerm) !== -1);
    console.log(this.listOfDataToDisplay);

  }
  searchID() { }
  searchOutletName() { }
  searchType() { }
  searchOutletRoute() { }
  searchLocation() { }
  searchCdCode() { }


  //date picker
  onChange(result: Date[]): void {
    console.log('From: ', result[0], ', to: ', result[1]);
  }

  // reset(): void{
  //  this.searchValue = '';
  //  this.search();
  // }

  // search(): void{
  //  this.visible = false;
  //  this.listOfDisplayData = this.listOfData.filter((item)=> 
  //  item.FullName.toLowerCase().indexOf(this.searchValue) !== -1
  //  );
  // }

  statusSearch() {
    // this.visible = false;
    console.log(this.searchStatus)
    if (this.searchStatus == false) {
      this.allStatus = false;
    }
    this.listOfDisplayData = this.listOfData.filter(item =>
      item.Active == this.searchStatus);
  }
  removeStatusFilter() {
    // this.visible = false;
    this.listOfDisplayData = this.listOfData

  }

  userNameSearch() {
    if (this.searchValue.length < 1) {
      return this.loadOutlets();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.UserName.toLowerCase().indexOf(this.searchValue) !== -1
      );
    }
  }
  emailSearch() {
    if (this.searchEmail.length < 1) {
      return this.loadOutlets();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.Email.toLowerCase().indexOf(this.searchEmail) !== -1
      );
    }
  }
  fullnameSearch() {
    if (this.searchfullName.length < 1) {
      return this.loadOutlets();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) =>
        item.FullName.toLowerCase().indexOf(this.searchfullName) !== -1
      );
    }
  }

  globalSearch() {
    if (this.searchInput.length < 1) {
      return this.loadOutlets();
    } else {
      this.listOfDisplayData = this.listOfData.filter((item) => {
        return item.UserName.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.FullName.toString().toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.Email.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase()) ||
          item.Active.toString().toLocaleLowerCase().match(this.searchInput.toLowerCase())
      })
    }
  }

  // Search/Filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  // applyFilter(event: Event) {
  //     const filterValue = (event.target as HTMLInputElement).value;
  //     this.visible = false;
  //     this.listOfDisplayData = this.listOfData.filter((item) => item.type.indexOf(filterValue) !== -1);
  //   }

  // sort(sort: { key: string, value: string }): void {
  //   this.sortName = sort.key;
  //   this.sortValue = sort.value;
  //   this.searchNztable();
  // }

  // searchNztable(): void{
  //   if (this.sortName) {
  //     const data = this.listOfData.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) : (b[this.sortName] > a[this.sortName] ? 1 : -1));
  //     this.alldata = [...data];
  //   } else {
  //     this.alldata = this.listOfData;
  //   }

  // }


  columnDefinitions = [
    { def: 'ID', label: 'ID', },
    { def: 'CREDIT_NAME', label: 'Credit Name', },
    { def: 'CREDIT_CODE', label: 'Credit Code', },
    { def: 'NAME', label: 'Name', },
    { def: 'CODE', label: 'Code', },
    { def: 'TYPE', label: 'Type', },
    { def: 'OUTLET_ROUTE', label: 'Outlet Route', },
    { def: 'LOCATION', label: 'Location', },
    { def: 'LATITUDE', label: 'Latitude', },
    { def: 'LONGITUDE', label: 'Longitude', },
    { def: 'CONTACT_NAME', label: 'Contact Name', },
    { def: 'CONTACT_PHONE', label: 'Contact Phone', },
    { def: 'CREATED_ON', label: 'Created On', },
    { def: 'CREATED_BY', label: 'Created By', },
    { def: 'REMARKS', label: 'Remarks', },
  ]
  show_hide_all() {
    this.checkList.forEach(item => {
        item.status = this.showAll
    });
  }

  showHideColumn(name: string): boolean {
    let temp = this.checkList.filter(item => item.name == name);
    return temp[0].status
  }

  toggleStatus(name: string) {
    this.checkList.forEach(item => {
      if (item.name == name) {
        item.status = !item.status
      }
        this.showAll = false;

    });
  }


    // showAllChecker(): boolean{
    //   if (this.id && this.outletName && this.outletCode && this.creditName && this.type && this.outletRoute && this.location
    //     && this.contactName && this.contactPhone && this.cdCode && this.latitude && this.longitude && this.createdBy &&
    //     this.createdOn && this.actions && this.remarks == true) {
    //     this.showAll = true;
    //   }
    //   else {
    //     this.showAll = false;
    //   }
    //   return true
    // }
    // show_hide_ID() {
    //   this.showHideID = !this.showHideID;
    //   this.showAllChecker();
    //   // if(this.showAllChecker() == true)
    //   //     {

    //   //     this.showAll = true;
    //   //     }
    //   //     else{
    //   //       this.showAll = false;
    //   //     }
    // }
    // show_hide_code() {
    //   this.showHideCode = !this.showHideCode;
    //   this.showAllChecker();

    // }
    // show_hide_latitude() {
    //   this.showHideLatitude = !this.showHideLatitude;
    //   this.showAllChecker();

    // }
    // show_hide_longitude() {
    //   this.showHideLongitude = !this.showHideLongitude;
    //   this.showAllChecker();

    // }
    // show_hide_remarks() {
    //   this.showHideRemarks = !this.showHideRemarks;
    //   this.showAllChecker();

    // }
    // show_hide_outletname() {
    //   this.showHideOutletName = !this.showHideOutletName;
    //   this.showAllChecker();
    // }
    // show_hide_creditname(){
    //   this.showHideCreditName = !this.showHideCreditName;
    //   this.showAllChecker();
    // }
    // show_hide_type(){
    //   this.showHideType = !this.showHideType;
    //   this.showAllChecker();
    // }
    // show_hide_outletroute(){
    //   this.showHideOutletRoute = !this.showHideOutletRoute;
    //   this.showAllChecker();
    // }
    // show_hide_location(){
    //   this.showHideLocation = !this.showHideLocation;
    //   this.showAllChecker();
    // }
    // show_hide_cdCode(){
    //   this.showHideCdCode = !this.showHideCdCode;
    //   this.showAllChecker();
    // }
    // show_hide_contactname(){
    //   this.showHideContactName = !this.showHideContactName;
    //   this.showAllChecker();
    // }
    // show_hide_contactphone(){
    //   this.showHideContactPhone = !this.showHideContactPhone;
    //   this.showAllChecker();
    // }
    // show_hide_createdby(){
    //   this.showHideCreatedBy = !this.showHideCreatedBy;
    //   this.showAllChecker();
    // }
    // show_hide_createdon(){
    //   this.showHideCreatedOn = !this.showHideCreatedOn;
    //   this.showAllChecker();
    // }
    // show_hide_actions(){
    //   this.showHideActions = !this.showHideActions;
    //   this.showAllChecker();
    // }
    // show_hide_details2() {
    //     this.showHideDetails= !this.showHideDetails;
    //   }
    //   show_hide_details3() {
    //     this.showHideDetails= !this.showHideDetails;
    //     }

    // Download PDF
    // exportOutletsPDF() {
    //   var prepare = [];
    //   this.listOfData.forEach(e => {
    //     var tempObj = [];
    //     tempObj.push(e.ID);
    //     tempObj.push(e.cdCode);
    //     tempObj.push(e.cdName);
    //     tempObj.push(e.productCode);
    //     tempObj.push(e.productDescription);
    //     tempObj.push(e.orderRef);
    //     tempObj.push(e.orderQuantity);
    //     tempObj.push(e.orderValue);
    //     tempObj.push(e.modeOfPayment);
    //     tempObj.push(e.status);
    //     prepare.push(tempObj);
    //   });
    //   // 'outletName','outletCode','outletType','outletRoute', 'location', 'latitude', 'longitude','cdName','cdCode','cdEmail','cdContactFullName', 'cdOfficePhoneNumber', 'contactName','contactMobileNumber','remarks'


    //   const doc = new jsPDF('l', 'mm', 'a4',);
    //   var fontSize = 12;
    //   var imageUrl = "./assets/images/iko-stock-logo.png";
    //   doc.setFontSize(fontSize);
    //   doc.addImage(imageUrl, 'JPEG', 125, 5, 35, 35,);
    //   doc.text("OUTLETS LIST", 130, 48,);
    //   autoTable(doc, {
    //     head: [['#', 'CD CODE', 'CD NAME', 'PRODUCT CODE', 'DESCRIPTION', 'ODER REF', 'QUANTITY', 'VALUE', 'PAY MODE', 'STATUS']],
    //     margin: { top: 5, horizontal: 5, bottom: 2, vertical: 5 },
    //     body: prepare,
    //     startY: 60,
    //     theme: 'striped',
    //     headStyles: { minCellHeight: 12, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 10 },
    //     foot: [['', '', '', '', '@Eclectics International', ' ', '', '',]],
    //     footStyles: { textColor: [255, 255, 255], font: "rotobo", fontSize: 10 },
    //     bodyStyles: { minCellHeight: 10, fontSize: 9.5 }
    //   });

    //   doc.save('Outlets_List' + '.pdf');
    // }


    //export PDF file

    exportOutletsPDF(){
      let element = 'table'
       let PDFTitle = 'Outlet List';
       this.global.exportPDF(element, 'Outlets', PDFTitle);

    }
    //export excel file
    exportOutletsExcel(){
      let element = document.getElementById('outletTable');
      this.global.exportTableElmToExcel(element, 'Outlets');
    }

    //export csv file
    exportOutletsCSV(){
      this.global.exportToCsv(this.listOfDataToDisplay,
      'Outlets', ['outletName', 'outletCode', 'outletType', 'outletRoute', 'location', 'latitude', 
      'longitude', 'cdName', 'cdCode', 'cdEmail', 'cdContactFullName', 'cdOfficePhoneNumber', 'contactName', 
      'contactMobileNumber', 'remarks']);
    }

    showFormDetails(){
      console.log("this.form");
      console.log(this.formAdd);

    }
  }
