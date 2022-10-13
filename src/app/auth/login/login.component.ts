import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QueryCommandInterface } from 'src/app/common/models/query_commands_interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginInterface } from '../models/login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  _queryCommandInterface: QueryCommandInterface;
  loginForm: FormGroup;
  _submitted: boolean = false;
  _loginModel: LoginInterface;
  _errorMessage: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });

  }
  public onSubmit(elementValues: any): void {
    this._submitted = true;
    this._queryCommandInterface = new QueryCommandInterface();
    this._queryCommandInterface.data.transaction_details = {
      username: elementValues.username,
      /* password: this._authService.hashPassword(elementValues.password), */
      password: elementValues.password,
      resource: 'login_user',
      url: '/LOGIN-USER'
    };
    console.log('We are here' + JSON.stringify(this._queryCommandInterface));
    this._authService.login(this._queryCommandInterface).subscribe(
      result => {
        console.log('Tovo', result);
        
        if (result['response']['response_code'] === '00' && result['data']['user']['account_status'] == 1) { // Force Password Change
          this.router.navigate(['/auth/changepassword']);
        } else if (result['response']['response_code'] === '00') {
       
          if(this._authService.getInstitutionid() == "CBL" && this._authService.getTerritorycode() ==="" && this._authService.getRegioncode() ==="")
          {  
            this.router.navigate(['/dashboards/sales-analytics']);
          }else if(this._authService.getInstitutionid() == "CBL" && this._authService.getRegioncode() !=="" && this._authService.getTerritorycode() !=="")
          {
            this.router.navigate(['/dashboards/tsm']);
          }else if(this._authService.getInstitutionid() == "CBL" && this._authService.getTerritorycode() ==="" && this._authService.getRegioncode() !=="")
          {
            this.router.navigate(['/dashboards/pg']);
          }
          else if(this._authService.getInstitutionid() == "CD")
          {
            this.router.navigate(['/dashboards/distributors']);
          }else{
            this.router.navigate(['/cooler-maintenance/users']);
          }
          // this.router.navigate(['/auth/changepassword']);
          
        } else if (result['response']['response_code'] === '01') {
          this._errorMessage = 'Invalid Username or Password';
        } else if (result['response']['response_code'] === '03') {
          this._errorMessage = 'User Blocked - 10 wrong Attempts';
        } else {
          this._errorMessage = result['response']['response_message'];
        }
        this._submitted = false;
      },
      error => {
        this._submitted = false;
        // Validation error
        console.log(error);
        if (error.status === 422) {
        } else {
          this._errorMessage = 'Server error.';
        }
        this._errorMessage = 'Server error.';
      }
    );
  }
  register(): void {
    this.router.navigate(['/auth/register']);
  }
  forgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
  onChange(value: any): void {
  }

}
