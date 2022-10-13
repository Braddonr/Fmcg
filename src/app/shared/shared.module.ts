import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";

import { A11yModule } from "@angular/cdk/a11y";
import { CdkPopoverEditModule } from "@angular/cdk-experimental/popover-edit";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatPopoverEditModule } from "@angular/material-experimental/popover-edit";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSharedFilterComponent } from './components/ng-shared-filter/ng-shared-filter.component';
import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChartsModule } from "ng2-charts";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { PortalHeaderTitleDirective } from "./directives/portal-header-title.directive";
import { LayoutLoaderComponent } from "./components/layout-loader/layout-loader.component";
import { CommonModule } from "@angular/common";
import { ToastrModule } from 'ngx-toastr';

import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { ActiveLabelComponent } from "./components/active-label/active-label.component";
import { ActiveStatusLabelComponent } from "./components/active-status-label/active-status-label.component";
import { BlockedLabelComponent } from "./components/blocked-label/blocked-label.component";
import { BlockedStatusComponent } from "./components/blocked-status/blocked-status.component";
import { ColumnsComponent } from "./components/columns/columns.component";
import { EditNotificationLabelComponent } from "./components/edit-notification-label/edit-notification-label.component";
import { SuccessLabelComponent } from "./components/success-label/success-label.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { LoaderComponent } from './loader/loader.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    BreadcrumbComponent,
    NgSharedFilterComponent,  
    // directives
    PortalHeaderTitleDirective,
    LayoutLoaderComponent,
    SuccessLabelComponent,
    ActiveLabelComponent,
    BlockedLabelComponent,
    BlockedStatusComponent,
    EditNotificationLabelComponent,
    ActiveStatusLabelComponent,
    ColumnsComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    A11yModule,
    CdkPopoverEditModule,
    CdkTableModule,
    CdkTreeModule,
    CdkStepperModule,
    DragDropModule,

    // nz modules
    NzCardModule,
    NzListModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzTabsModule,
    NzDropDownModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzSpinModule,
    MatListModule,
    NzPopconfirmModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTimePickerModule,


    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatPopoverEditModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    PortalModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    DateRangePickerModule,

    ChartsModule,
    NgxDatatableModule,
    FlexLayoutModule,

    TranslateModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
    ToastrModule.forRoot()

  ],
  exports: [
    DateRangePickerModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    A11yModule,
    CdkPopoverEditModule,
    CdkTableModule,
    CdkTreeModule,
    CdkStepperModule,
    DragDropModule,

    // nz modules
    NzCardModule,
    NzListModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzInputModule,
    NzTableModule,
    NzTabsModule,
    NzDropDownModule,
    NzIconModule,
    NzCheckboxModule,
    NzTagModule,
    NzSpinModule,
    MatListModule,
    NzPopconfirmModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTimePickerModule,
    
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatPopoverEditModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ScrollingModule,
    PortalModule,
    MatNativeDateModule,
    ChartsModule,
    NgxDatatableModule,
    FlexLayoutModule,

    // directives
    PortalHeaderTitleDirective,

    TranslateModule,
    //SHARED COMPONENTS
    NgSharedFilterComponent,
    BreadcrumbComponent,
    LayoutLoaderComponent,
    SuccessLabelComponent,
    ActiveLabelComponent,
    BlockedLabelComponent,
    BlockedStatusComponent,
    EditNotificationLabelComponent,
    ActiveStatusLabelComponent,
    ColumnsComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedModule { }
