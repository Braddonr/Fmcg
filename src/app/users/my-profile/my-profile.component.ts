import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  user: any;

  constructor() { }

  ngOnInit(): void {
    this.getDetails();
  }

  //retrieves current user's details
  getDetails(): void {
    let loggedUser = localStorage.getItem("currentUser");
    this.user = JSON.parse(loggedUser);
  }

}
