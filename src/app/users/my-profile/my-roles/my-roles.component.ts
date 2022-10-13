import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';


@Component({
  selector: 'app-my-roles',
  templateUrl: './my-roles.component.html',
  styleUrls: ['./my-roles.component.scss']
})
export class MyRolesComponent implements OnInit {

  loading: boolean = false;
  profiles: any[];

  constructor(
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.loadProfiles();
  }

  //retrieves current user's profiles
  loadProfiles(): void {
    this.loading = true;
    this._httpService.get("api/v1/workflow/get-users-profile").subscribe(res => {
      this.profiles = res["data"]["present"];
      this.loading = false;
      console.log(this.profiles);
    })
  }
}
