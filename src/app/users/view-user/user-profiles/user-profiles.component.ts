import { Component, OnInit, Input } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-user-profiles',
  templateUrl: './user-profiles.component.html',
  styleUrls: ['./user-profiles.component.scss']
})
export class UserProfilesComponent implements OnInit {

  // @Input () user: any;
  cardTitle: string;
  loading: boolean = false;
  page: number = 1;
  perPage: number = 10;
  profiles: any[];
  total: number;
  blockedStatus: boolean = false;
  blockValidated: boolean = false;
  idUser: number;
  user: any;

  constructor(
    private _httpService: HttpService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cardTitle = `${this.user['firstName']}'s Profiles`;
    this.loadData();
  }

  //retrieves single user profiles
  loadData(): void {
    this.loading = true;
    let model = {
      userEmail: this.user['email']
    };
    this._httpService.post('api/v1/workflow/fetch-profile-user', model).subscribe(res => {
      if (res['status'] === 200) {
        this.profiles = res['data']['present'];
        this.loading = false;
      } else {
        this.toastr.error("User's profiles cannot be retrieved at the moment", "Error!");
        this.loading = false;
      }
    })
  }

   //retrieves single user details
  

}
