import { ListUsersComponent } from './../list-users/list-users.component';
import { UserDetails } from './../../common/models/response_command_interface';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  page: number = 1;
  perPage: number = 10;
  UserDetails:any;
  firstName: string;

  UserId: number;
  

  constructor( private _httpService: HttpService, private dialogRef: MatDialogRef < ListUsersComponent > , @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit(): void {
    let model = {
      page: (this.page - 1),
      size: this.perPage
    }

    this._httpService.retrieveData('user/all', model).subscribe(res => {
      if(res['responseCode'] === 200) {
        this.UserDetails = res['data'];
        this.UserDetails = res.find(a => a.id == this.UserId);
        
          console.log('UserDetails');
          console.log(this.UserDetails);
        //console.log("created users: ", this._data);

        // @ts-ignor



      } else {
        // this.toaster.error('Users cannot be retrieved at the moment', 'Error!')
      }
      
    })
  }

  close() {  
    this.dialogRef.close();  
} 

}
