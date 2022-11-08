import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, retry} from 'rxjs/operators';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';


@Injectable(
 
)
export class SystemHttpInterceptor implements HttpInterceptor {
  static readonly REFRESH_PAGEON_TOAST_CLICK_MESSAGE: string = "An error occurred, click to refresh";
  static readonly DEFAULT_ERROR_TITLE: string = "Something went wrong";
  constructor( 
    public toastrService: ToastrService,
    private auth: AuthService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
    .pipe(
    retry(1),
      catchError((err: HttpErrorResponse)=>{
        if(err.status === 401){
          this.toastrService.error('logging Out...', 'Your session has expired');
          this.auth.signOut();
        }
       else if(err.status === 403){
          this.toastrService.error("Unauthorized Access!", "Access Denied" )
         
        }
        
        else {
          console.log("success!");
          // this.showError(SystemHttpInterceptor.REFRESH_PAGEON_TOAST_CLICK_MESSAGE);
        }
      
      return throwError(err);
    }));

    };
  }


