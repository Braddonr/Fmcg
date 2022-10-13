import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

 
  errorMessage: string;
  form: FormGroup;
  loading: boolean;
  returnUrl: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService

  ) { 
    if (authService.currentUser) {
      this.router.navigate(['/']);
    } else {
      authService.signOut();
    }
  }

  ngOnInit(): void {
    this.authService.signOut();
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    this.form = this.fb.group({
      username: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])]
    });
  }

  editField() {
    document.getElementById('Password').removeAttribute("readonly");
  }

  //logs in user
  login(): void {
    this.loading = true;
    console.log("sample login");
    
    this.authService.userLogin(this.form.value.username, this.form.value.password)
      .pipe(first())
            .subscribe(res =>  {
              
              let user  = localStorage.getItem("thisUser");
              console.log("current user ", user);

              if(user){
                this.loading = false;
                console.log("current user ", localStorage.getItem('currentUser'));
              this.router.navigateByUrl(this.returnUrl);

              }
              
              
              // let user = JSON.parse(localStorage.getItem('currentUser'));
              // if (user.isFirstTimeLogin == false) {
              //   this.router.navigateByUrl(this.returnUrl);
              // } else {
              //   this.router.navigate(["/auth/set-password"])
              // }             
            },
            error => {
                if (error.responseCode == 400) {
                    this.errorMessage = error.message;
                    this.loading = false;
                }
            });
    
  }

}
