import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwError } from 'rxjs/';
import CryptoJS from 'crypto-js';
import { JwtInterceptor } from './jwt.interceptor';
import { LoginInterface } from 'src/app/auth/models/login';
import { RegistrationForm } from 'src/app/auth/models/registration-form';
import { PasswordResetInterface } from 'src/app/auth/models/password-reset-interface';
import { QueryCommandInterface } from 'src/app/common/models/query_commands_interface';
import { ResponseCommandInterface } from 'src/app/common/models/response_command_interface';
import { GlobalService } from './global.service';



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    _queryCommandInterface: QueryCommandInterface;
    _responseCommandInterface: ResponseCommandInterface;
    private rtabasjaana: any = 'uusdhhdflas';
    public loggedIn: boolean = false;
    public redirectURL: string = '';
    public jwtHelper: any = new JwtHelperService();
    private response: any;
    _currentUser: any;
   returnUrl;

    constructor(
        private _router: Router,
        private http: HttpClient,
        private _globalService: GlobalService,
        private _interceptor: JwtInterceptor,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.loggedIn = this.isLoggedIn();
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

    }

    private static generateHeaders(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    public getAllTransToken(): any {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic dXNlcjpwYXNzd29yZA=='
        });
        this._queryCommandInterface = new QueryCommandInterface();
        this._queryCommandInterface.data.transaction_details = {
            account: 'mungai.john@ekenya.co.ke',
            credentials: 'Admin1234',
            grant_type: 'access_token',
            transaction_type: 'USERS',
            direction: 'REQUEST',
            req_type: 'login_user'
        };
        // this._globalService.apiHost + '/user/login',
        return this.http.post(this._globalService.fmcgHost + '/user/login', this._queryCommandInterface, { headers: headers }).pipe(
            map(data => {
                data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
                if (data['response']['response_code'] === '00') {
                    localStorage.setItem('token', data['data']['access_token']);
                } else {
                    localStorage.removeItem('token');
                }
                return data;
            }
            ));
    }



    // ////////////////////////////
    public signOut(): void {
        this._router.navigate(['auth/sign-in']);
        localStorage.removeItem('token');
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        localStorage.removeItem("thisUser");
        this.loggedIn = false;


    }
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json; charset=UTF-8'
        });
    }

    public userLogin(username: string, password: string): Observable<any> {
        
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const model = {
            username: username,
            password: password
        }

        return this.http.post(this._globalService.logEndpoint, model, { headers: this.getHeaders() }).pipe(map(user => {
            console.log("user data", user);

            if (user && user['authToken']) {
              console.log("url user", user);

                this.router.navigateByUrl(this.returnUrl);
              console.log("url link", this.returnUrl);
                localStorage.setItem('token', user['authToken']);
                this._currentUser = this.jwtHelper.decodeToken(localStorage.getItem('token'));

                localStorage.setItem("thisUser", this._currentUser['sub']);
                localStorage.setItem('currentUser', JSON.stringify(this._currentUser));
                localStorage.setItem('refreshToken', user['refreshToken'])
                let roles = user['user_roles'].map(role => {
                    return role.name;
                })
                localStorage.setItem('userRoles', JSON.stringify(roles));
              
              

                return true
            } else {
                return false;
            }
        }))
    }

    get currentUser(): any {
        // return this._currentUser;
        return localStorage.getItem("thisUser");
    }
    public login(model: LoginInterface): any {
        this._responseCommandInterface = new ResponseCommandInterface();
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
            // 'Authorization': 'Basic dXNlcjpwYXNzd29yZA==',
        });
        const endpoint = '';
        return this.http.post(this._globalService.apiUniversalHost, model, { headers: headers }).pipe(
            map(data => {
                data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
                if (data['statusCode'] === '00') {
                    // local storage
                    localStorage.setItem('roles', data['roles']);
                    localStorage.setItem('username', data['userDetails']['userName']);
                    localStorage.setItem('userInstitutionCode', data['userDetails']['userInstitutionCode']);
                    localStorage.setItem('userInstitutionID', data['userDetails']['userInstitutionID']);
                    localStorage.setItem('userTerritoryCode', data['userDetails']['territoryCode']);
                    localStorage.setItem('userRegionCode', data['userDetails']['regionCode']);


                    // roles n profiles
                    this._responseCommandInterface.data.profiles = data['profiles'];
                    this._responseCommandInterface.data.roles = data['roles'];
                    // status
                    this._responseCommandInterface.response.response_code = data['statusCode'];
                    this._responseCommandInterface.response.response_message = data['statusDescription'];
                    // user data
                    this._responseCommandInterface.data.user.username = data['userDetails']['userName'];
                    this._responseCommandInterface.data.user.email_address = data['userDetails']['email'];
                    this._responseCommandInterface.data.user.first_name = data['userDetails']['firstName'];
                    this._responseCommandInterface.data.user.middle_name = data['userDetails']['middleName'];
                    this._responseCommandInterface.data.user.surname = data['userDetails']['lastName'];
                    this._responseCommandInterface.data.user.phone_number = data['userDetails']['mobileNumber'];
                    this._responseCommandInterface.data.user.account_status = data['userDetails']['firstLogin'];
                    this._responseCommandInterface.data.user.login_trials = data['userDetails']['trials'];
                    // logged in
                    this.loggedIn = true;
                } else if (data['statusCode'] !== '00') {
                    // status
                    this._responseCommandInterface.response.response_code = data['statusCode'];
                    this._responseCommandInterface.response.response_message = data['statusDescription'];
                } else {
                    localStorage.removeItem('token');
                    this.loggedIn = false;
                }
                console.log(this._responseCommandInterface);
                return this._responseCommandInterface;
            }
            ));
    }
    // public changePassword(model: any): any {
    //     model.data.transaction_details.credentials = this.hashPassword(model.data.transaction_details.credentials);
    //     model.data.transaction_details.old_password = this.hashPassword(model.data.transaction_details.old_password);
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //     });
    //     return this.http.post(this._globalService.apiHost + '/token', model, { headers: headers }).pipe(
    //         timeout(5000),
    //         catchError( err => {
    //            return Observable.throw('Timeout has occurred');
    //         }),
    //         map(data => {
    //             data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
    //             return data;
    //         }
    //         ));
    // }
    public changePassword(endpoint: any, model: any): any {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic dXNlcjpwYXNzd29yZA=='
        });
        model.data.channel_details.user = this.getUsername();
        model.data.transaction_details.url = endpoint;
        return this.http.post(this._globalService.apiUniversalHost + endpoint, model, { headers: headers }
        ).pipe(
            map(data => {
                data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
                console.log(data);
                return data;
            }
            )
        );
    }
    public hashPassword(pass: any): string {
        const hash = CryptoJS.HmacSHA256(pass, this.rtabasjaana);
        const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        return hashInBase64;
    }
    // public getRandomSpan(): number {
    //     return Math.floor((Math.random() * 6) + 1);
    // }
    public register(data: RegistrationForm): Observable<any> {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        return this.http.post(this._globalService.apiHost + '/auth/default/signup', data, { headers: headers }
        ).pipe(map(response => {
            return response;
        }));
    }
    public recover(model: PasswordResetInterface): any {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this._globalService.apiHost + '/customer/recover', model, { headers: headers }
        ).pipe(
            map(data => {
                data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
                return data;
            }));
    }
    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('username');
        this.loggedIn = false;
    }
    public getToken(): any {
        return localStorage.getItem('token');
    }

    public getUsername(): any {
        return localStorage.getItem('username');
    }

    public getInstitutioncode(): any {
        return localStorage.getItem('userInstitutionCode');
    }

    public getInstitutionid(): any {
        return localStorage.getItem('userInstitutionID');
    }

    public getTerritorycode(): any {
        return localStorage.getItem('userTerritoryCode');
    }
    public getRegioncode(): any {
        return localStorage.getItem('userRegionCode');
    }

    private checkToken(): any {
        return !!localStorage.getItem('token');
    }

    public unauthorizedAccess(): void {
        this.logout();
        this._router.navigate(['/auth/login']);
    }

    public isLoggedIn(): any {
        // const token = this.getToken();
        // if (token !== null) {
        //     return !this.jwtHelper.isTokenExpired(token);
        // } else {
        //     return false;
        // }
        const is_username = this.getUsername();
        if (is_username == null) {
            return false;
        } else {
            return true;
        }
    }

    public getJWTValue(): any {
        const token = this.getToken();
        console.log('============JWTVALUE================');
        console.log(token);
        console.log('============TOKENVALUE================');
        console.log(this.jwtHelper.decodeToken(token));
        return this.jwtHelper.decodeToken(token);
    }
    public getProfiles(): any {
        const jwtValue: any = this.getJWTValue();
        return jwtValue.profiles;
    }
    public getRoles(): any {
        const jv: any = this.getJWTValue();
        return jv.roles;
    }
    private handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            // console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            /*  console.error(
                  `Backend returned code ${error.status}, ` +
                  `body was: ${error.error}`); **/
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }


    public hasPriveledge(priveledge: string): boolean {
        /* console.log(localStorage.getItem('roles'),localStorage.getItem('roles').indexOf(priveledge));  */
        if (localStorage.getItem('roles').indexOf(priveledge) > -1) {
            return true;
        } else {
            return false;
        }

        //return true;   
    }

}

