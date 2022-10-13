import * as Screenfull from "screenfull";

import { Component, EventEmitter, Output } from "@angular/core";
import { Router } from '@angular/router';
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent {
  @Output()
  toggleSidenav = new EventEmitter<void>();
  @Output()
  toggleNotificationSidenav = new EventEmitter<void>();

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  fullScreenToggle(): void {
    if (Screenfull.isEnabled) {
      Screenfull.toggle();
    }
  }
  signOut() {
    // this.router.navigate(['session/signin'])
    

    this.auth.signOut();

  }
}
