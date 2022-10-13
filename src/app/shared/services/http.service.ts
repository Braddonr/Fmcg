import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
@Injectable({
    providedIn:"root"
})
export class HttpService {
  public loggedIn: boolean = false;
  public loadedData: any[];
  errorMessage: string;
  constructor(
    private http: HttpClient,
    private _globalService: GlobalService,
    private _authService: AuthService,
    private _interceptor: JwtInterceptor,
    private toastr: ToastrService
  ) { }

  private getHeaders(contentType?: string): HttpHeaders {
    const cType = contentType ? contentType : 'application/json';
    return new HttpHeaders({

          'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._authService.getToken()
    });
  }

  public get(endpoint: string,  page?:number, size?:number, id?: number): any {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());
    
    return this.http.get(this._globalService.fmcgHost + endpoint,
        { headers: this.getHeaders() , params: params
            }
    ).pipe(
        map(
            response => {
        response = response;
        return response;
    }
    ));
}


public retrieveData(endpoint: string,  model): any {
  let params = new HttpParams()
  .set('page', model.page.toString())
  .set('size', model.size.toString());
  
  return this.http.get(this._globalService.fmcgHost + endpoint,
      { headers: this.getHeaders() , params: params
          }
  ).pipe(
      map(
          response => {
      response = response;
      return response;
  }
  ));
}

public getData(endpoint: string) {
  let params = new HttpParams()

  return this.http.get(this._globalService.fmcgHost + endpoint,
      { headers: this.getHeaders() , params: params
          }
  ).pipe(
      map(
          response => {
      response = response;
      return response;
  }
  ));
}

 //returns error message
 loadErrorMessage(): string {
  this.errorMessage = 'This action is forbidden, your current profile lacks the relevant role';
  return this.errorMessage;
}

public postAudit(endpoint: string, model: any): any {
return this.http.post(this._globalService.auditEndpoint + endpoint, model, { headers: this.getHeaders() }
).pipe(map(response => {
  // console.log(response)
    response = response;
    return response;
}));
}

  public getReportData(endpoint){
    let params = new HttpParams()
    return this.http.get(this._globalService.apiHost + endpoint,
        { headers: this.getHeaders() , params: params
            }
    ).pipe(
        map(
            response => {
        response = response;
        return response;
    }));
}

getAllUsers(){
  this.getReportData('ApplicationUser/AllUsers').subscribe(res=>{
      if(res['status'] == 200 || res['status'] == 201){
          let data= res['data']['content'];
          const authId = data.filter(item=> item.UserName == localStorage.getItem('userName'))[0];
          localStorage.setItem('authId', authId);
          
      }
  })
}
public getDataById(endpoint: string, id: string){
  let params = new HttpParams()
  return this.http.get(this._globalService.fmcgHost + endpoint,
      {
          headers: this.getHeaders(), params: params
      }).pipe
          (
              map(
                  response => {
                      response = response;
                      return response;
                  },
                  (items)=> items.find(item => item.id === id)
              )
          )
}

public getDetailsById(endpoint: string, id: string){
  let parameter = new HttpParams()
  return this.http.get(this._globalService.fmcgHost + endpoint + id, { headers: this.getHeaders()}
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}

public getUserByUsername(endpoint: string, userName: string){
  let parameter = new HttpParams().set('username', userName);
  return this.http.get(this._globalService.fmcgHost + endpoint, { headers: this.getHeaders(), params: parameter}
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}

public post(endpoint: string, model?: any): any {
    
  return this.http.post(this._globalService.fmcgHost + endpoint, model, { headers: this.getHeaders() }
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}

public put(endpoint: string, model: any): any {
  return this.http.put(this._globalService.fmcgHost + endpoint, model, { headers: this.getHeaders() }
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}

// public delete(endpoint: string, id: string): any {
    
//   return this.http.delete(this._globalService.fmcgHost + endpoint + id)
//   .pipe(map(response => {
//       response = response;
//       return response;
//   }));
// }


public delete(endpoint: string, id?: string): any {
  return this.http.delete(this._globalService.fmcgHost + endpoint, { headers: this.getHeaders()}
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}

public deleteId(endpoint: string, id: string){
  let parameter = new HttpParams()
  return this.http.delete(this._globalService.fmcgHost + endpoint + id, { headers: this.getHeaders()}
  ).pipe(map(response => {
      response = response;
      return response;
  }));
}
  
    // cancel a form
    deleteResource(endpoint: string, refreshList: any) {
      Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this record!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, keep it'

      }).then((result) => {
          if (result.value) {
             
              this.delete(endpoint)
                  .subscribe(res => { 
                      if (res) {
                          Swal.fire(
                              'Successful!',
                              'Deletion successful.',
                              'success'
                          );
                          refreshList();
                      } else {
                          Swal.fire(
                              'Error!',
                              'Deletion failed, ',
                              'error'
                          );
                      }
                  });
              // console.log(model);
          } else {
              refreshList();
          }
      });
  }

  // added from httpUniversal
  public getSalesData(model): any {
    model.data.channel_details.user = this._authService.getUsername();
    return this.http.post(this._globalService.apiUniversalHost, model
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log('sales data');
        console.log(data);
        return data;
      }
      )
    );
  }
  public getAll(endpoint: any, model: any): any {
    return this.http.post(this._globalService.apiHost + endpoint, model, { headers: this.getHeaders() }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log('data');
        console.log(data);
        return data;
      }
      )
    );
  }
  // added from httpUniversal
  public getQr(endpoint: any, model: any): any {
    model.data.channel_details.user = this._authService.getUsername();
    model.data.transaction_details.url = endpoint;
    return this.http.post(this._globalService.apiQrHost + endpoint, model, { headers: this.getHeaders() }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log(data);
        return data;
      }
      )
    );
  }
  public getOne(endpoint: any, model: any): any {
    return this.http.post(this._globalService.apiHost + endpoint, model, { headers: this.getHeaders() }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log(data);
        return data;
      }));
  }
  public add(endpoint: any, model: any): any {
    return this.http.post(this._globalService.apiHost + endpoint, model
      , { headers: this.getHeaders() }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log(data);
        return data;
      }));
  }
  public buildFormData(formData: any, data: any, parentKey: any): any {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? '' : data;
      formData.append(parentKey, value);
    }
  }
  public jsonToFormData(data: any): any {
    const formData = new FormData();
    this.buildFormData(formData, data, null);
    return formData;
  }
  public edit(endpoint: any, model: any): any {
    return this.http.post(this._globalService.apiHost + endpoint, model
      , { headers: this.getHeaders() }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        return data;
      }));
  }

  public getEmergencyContacts(): any {
    return this.http.get('/assets/json/emergencycontactslist.json');
  }
  public getFromJson(endpoint: string): any {
    return this.http.get(endpoint).pipe(
      map(data => {
        return data;
      }));
  }
  public upload(formModel: any): any {
    return this.http.post(this._globalService.apiHost + '/upload_test', formModel);
  }
  public uploadImage(endpoint: string, model: any, image: any): Observable<any> {
    const modelStringified = JSON.stringify(model);
    const formData = new FormData();
    formData.append('File1', image);
    formData.append('data', modelStringified);
    return this.http.post(this._globalService.apiHost + endpoint, formData
      , { headers: this.getHeaders('multipart/form-data') }
    ).pipe(
      map(data => {
        data = this._interceptor.x_message_type === '2' ? this._interceptor.decrypt(data['data']) : data;
        console.log(data);
        return data;
      }));
  }
  // Other APIs
  public makeRequest(method: string, endpoint: string, data?: any): any {
    switch (method) {
      case 'get':
        console.log('not dsdsd');
        return this.http.get(endpoint).pipe(
          map(response => {
            return response;
          }));
      case 'post':
        return this.http.post(endpoint, data).pipe(
          map(response => {
            return response;
          }));
      default:
        break;
    }

  }

     // handle errors
    getError(err: any){
        if(err instanceof HttpErrorResponse){
       
           switch(err.status){
             case 400: {
               return this.toastr.error(`Error Code: ${err.status}, Bad Request`, `Error Message: ${err.error.title}`);
             }
             case 403: {
               return this.toastr.error(`Error code: ${err.status}, Access Denied!`, `Error Message: ${err.error}`);
             }
             case 404: {
               return this.toastr.error(`Error code: ${err.status}`, `Error Messsage: Not Found!`);
             }
             case 500: {
               return this.toastr.error(`Error code: ${err.status}`, `Error Message: ${err.error}`);
             }
             default: {
               return this.toastr.error(`Unknown Server Error: ${err.message}`);
             }
           }
      
         }
      }

}
