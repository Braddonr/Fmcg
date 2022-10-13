import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-add-territory',
  templateUrl: './add-territory.component.html',
  styleUrls: ['./add-territory.component.scss']
})
export class AddTerritoryComponent implements OnInit {
  cardTitle: string;
  editBool: boolean;
  editData: boolean;
  territory:any;
  errorMessage: string;
  form: FormGroup;
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<AddTerritoryComponent>,
    private _httpService: HttpService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.editBool = this.data['updateTerritory'];
    this.editData = this.data['updateTerritory'];
    this.cardTitle = this.editData ? "Update Territory Details": "Add New Territory";
    this.territory = this.data['data'];

    this.form = this.fb.group({
      territoryName:[this.territory ? this.territory['territoryName']: '', Validators.compose([Validators.required])],
      territoryCode:[this.territory ? this.territory['territoryCode']: '', Validators.compose([Validators.required])],
      territoryManager:[this.territory ? this.territory['territoryManager']: '', Validators.compose([Validators.required])],
      brand:[this.territory ? this.territory['brand']: '', Validators.compose([Validators.required])],
      unitId:[this.territory ? this.territory['unitId']: '', Validators.compose([Validators.required])],
      units:[this.territory ? this.territory['units']: '', Validators.compose([Validators.required])],
      productDescription:[this.territory ? this.territory['productDescription']: '', Validators.compose([Validators.required])],
      remarks:[this.territory ? this.territory['remarks']: '', Validators.compose([Validators.required])],
    });


  }

  //closes dialog
  close(): void {
    setTimeout(() => {
      this.dialogRef.close();
    }, 500);
  }

}
