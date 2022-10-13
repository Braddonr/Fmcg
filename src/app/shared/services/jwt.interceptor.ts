import { Router } from '@angular/router';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import {  catchError } from 'rxjs/operators';
import  'rxjs/add/operator/map';
import CryptoJS from 'crypto-js';
import { GlobalService } from './global.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class JwtInterceptor implements HttpInterceptor {
  gshsdadsamdasdsadh: string = '9pbY4HfiTXuHzOHroBci/gIaZBrTLBlrt6RE/Q8MvOg=';
  gdsgdsdiodsdba: string = '';
  iv_: string = '';
  ohnananadav: string = '';
  ohnananadav_iv: string = '';
  x_message_type: string = '0';
  constructor(private _globalService: GlobalService, private _router: Router) {
    this.gdsgdsdiodsdba = this.gshsdadsamdasdsadh.substr(0, 16);
    this.iv_ = this.gshsdadsamdasdsadh.substr(this.gshsdadsamdasdsadh.length - 16);
    this.ohnananadav = CryptoJS.enc.Utf8.parse(this.gdsgdsdiodsdba);
    this.ohnananadav_iv = CryptoJS.enc.Utf8.parse(this.iv_);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (req.body) {
       // Encrpty if x message type == 2
       if ( this.x_message_type === '2') {
        req.body.data = this.encrypt(req.body.data);
       }
      const reqClone = req.clone({
        setHeaders: {
          'x-message-type': this.x_message_type,
          'Content-Type': 'application/json',

        },
        body: req.body
      });
      return next.handle(reqClone)
        .map(resp => {
          if (resp instanceof HttpResponse) {
            resp.body.data = resp.body.data;
          }
          return resp;
        }).pipe(catchError(err => {
          console.log('Error on JWT');
          if (err.status === 401) {
            this._router.navigate(['/auth/login']);
            // auto logout if 401 response returned from api
            // this.authenticationService.logout();
            return Observable.throw(err);
          }
        }));
    }
  }
  encrypt(payload: any): any {
    const encodedStringifiedPayload = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
    const cipherText = CryptoJS.AES.encrypt(
      encodedStringifiedPayload,
      this.ohnananadav,
      {
        iv: this.ohnananadav_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    ).ciphertext.toString(CryptoJS.enc.Base64);
    return cipherText;
  }
  decrypt(encryptedPayload: any): any {
    const originalPayload = {
      data: ''
    };
    // decrypt if x-message-type === 2
    if (this.x_message_type === '2') {
    const decrypt = CryptoJS.AES.decrypt(encryptedPayload, this.ohnananadav,
      {
        iv: this.ohnananadav_iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
  } else { // Just return the payload
    return encryptedPayload;
  }
}
}
