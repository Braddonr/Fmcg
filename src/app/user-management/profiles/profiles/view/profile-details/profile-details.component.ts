import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from "src/app/shared/services/http.service";

@Component({
  selector: "app-profile-details",
  templateUrl: "./profile-details.component.html",
  styleUrls: ["./profile-details.component.scss"],
})
export class ProfileDetailsComponent implements OnInit {

  profile: any;
  constructor(private router: Router, private route: ActivatedRoute, private httpService: HttpService) {
    // this.profile = JSON.parse(localStorage.getItem('profile_details'))
    const id = this.route.snapshot.params['id'];
    if(id !== undefined)
  {  console.log("Profile ID:", id);
    this.getProfileById(id);}
  }

  ngOnInit() {}

  getProfileById(id: any){
this.httpService.getDataById("Profiles", id).subscribe(res => {
  let dataArray = res['data']['content'];
let i = dataArray.filter(requiredId => {
  if(id == requiredId.ProfileId){
    console.log("retrieved id ", requiredId.ProfileId);
    return id = requiredId.ProfileId
    
  }
})[0];
  console.log(i);
  this.profile = i;
})
}
  
}
