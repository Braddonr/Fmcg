import { Injectable } from '@angular/core';
import moment from 'moment';
import { QueryCommandInterface } from 'src/app/common/models/query_commands_interface';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public auditEndpoint: string;
  public apiHost: string;
  public apiUniversalHost: string;
  public apiQrHost: string;
  public resourcesHost: string;
  public myApiHost: string;
  public useMine: boolean = false;
  public setting: any = {};
  public _queryCommandInterface: QueryCommandInterface;
  public editorConfig: any;
  public phoneNumberFormats: any = {
    international: 'international',
    local: 'local'
  }
  fmcgHost: string;
  logEndpoint: string;
  constructor() {
    // this.apiHost = 'http://10.20.31.115:8081/api';
    //  this.resourcesHost = 'http://10.20.31.115:8081/api/resource/';
    // this.apiHost = 'http://172.20.88.26:8081/api';
    // this.resourcesHost = 'http://172.20.88.26:8081/api/resource/';
   //this.apiHost = 'https://saccotest.ekenya.co.ke:80913/api'; 
   //this.resourcesHost = 'https://saccotest.ekenya.co.ke:80913/api/resource/';
   //this.apiUniversalHost = 'https://testgateway.ekenya.co.ke:8085/cblrouting/cbl.php';
   this.apiUniversalHost = 'https://test-portal.ekenya.co.ke/crownbeverages/solution/api/v1.0/portal';
   //this.apiQrHost = 'http://192.168.1.112/cblrouting/qrcode.php';
   this.apiQrHost = 'http://192.168.1.112:80/cblrouting/qrcode.php';
    //this.apiUniversalHost = 'http://10.20.2.202:9080/crownbeverages/solution/api/v1.0/portal';
   // WFP internal
  //  this.apiHost = 'http://10.20.2.4:8091/api';
  //  this.resourcesHost = 'http://10.20.2.4:8091/api/resource/';
     // wiki
      // this.apiHost = 'https://10.20.2.98:8081/api';
      // this.resourcesHost = 'https://10.20.2.98:8081/api/resource/';
    // WFP external
    // this.apiHost = 'https://160.119.244.22:8081/api';
   // this.resourcesHost = 'https://160.119.244.22:8081/api/resource/';

    this.myApiHost = 'http://api.yii2.local';
    this.apiHost = 'https://test-portal.ekenya.co.ke/crownbeverages/solution/api/v1.0/portal';
    this.fmcgHost = "https://test-api.ekenya.co.ke/iko-stock-fmcg/api/v2/";
    this.logEndpoint = "https://test-api.ekenya.co.ke/iko-stock-fmcg/api/v2/auth/login";
/*    this._queryCommandInterface = {
      txntimestamp: '2018 06 13 12:14:34.483 EAT',
      data: {
        transaction_details: {},
        channel_details: {
          channel_key: '123456',
          host: '127.0.0.1',
          geolocation: 'android kit kat',
          user_agent_version: window.navigator.appVersion,
          user_agent: window.navigator.userAgent,
          client_id: 'UNIVERSAL',
          channel: 'WEB_PORTAL',
          user: 'username'
          // client_id: 'wielbkn,sn;diosld',
          // channel: 'WEB_PORTAL'
        }
      },
      xref: '466043953434',
      upload_data: '',
      upload_name: '',
      content_type: 'image/png'
    };*/
    this._queryCommandInterface = {
      data: {
        transaction_details: {},
        channel_details: {
          credential: 'jsjhvucguggdfifdiuhfdi',
          user_agent: 'Mozilla',
          channel: 'WEB_PORTAL',
        }
      },
      upload_data: '',
      upload_name: '',
      content_type: 'image/png'
    };
    this.editorConfig = {
      'editable': true,
      'spellcheck': true,
      'height': 'auto',
      'minHeight': '200',
      'width': '10',
      'minWidth': '0',
      'translate': 'yes',
      'enableToolbar': true,
      'showToolbar': true,
      'placeholder': 'Enter text here...',
      'imageEndPoint': '',
      'toolbar': [
        ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
        ['fontName', 'fontSize', 'color'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
        ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
        ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList'],
        ['link', 'unlink', 'image', 'video']
      ]
    };
  }
  loadGlobalSettingsFromLocalStorage(): void {
    if (localStorage.getItem('backend-setting') !== null) {
      this.setting = JSON.parse(localStorage.getItem('backend-setting'));
    }

  }
  // async  delay(ms: number) {
  async  delay(ms: number): Promise<void> {
    await new Promise<any>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log(''));
  }
  // get Unique values in an array
  public uniqueBy(arr: any, fn: any): any {
    const unique = {};
    const distinct = [];
    arr.forEach(function (x: any): any {
      const key = fn(x);
      if (!unique[key]) {
        distinct.push(key);
        unique[key] = true;
      }
    });
    return distinct;
  }

  public getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }

  // Returns an array of dates between the two dates
  enumerateDaysBetweenDates(startDate: any, endDate: any): any {
    startDate = moment(startDate);
    endDate = moment(endDate);
    const now = startDate;
    const dates = [];
    while (now.isBefore(endDate) || now.isSame(endDate)) {
      dates.push(Number(now.format('YYYYMMDD')));
      now.add(1, 'days');
    }
    return dates;
  }

  /**
   * Shuffles array in place. ES6 version
   * @param {Array} a items An array containing the items.
   */
  public shuffle(a: any): any {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  public formatPhoneNo(phoneNumber: string, format: string, prefix?: string): string {
    switch (format) {
      case this.phoneNumberFormats.local:
          phoneNumber =  this.phoneToLocal(phoneNumber, prefix);
        break;
        case this.phoneNumberFormats.international:
            phoneNumber = this.phoneToInternational(phoneNumber, prefix);
          break;
      default:
        break;
    }


    return phoneNumber;
  }
  public phoneToLocal(phoneNumber: string, prefix?: string): string {
    let prfx = prefix ? prefix : '';
    if(phoneNumber.length >= 12){
      let cCode = phoneNumber.substring(0, 3);
      if(cCode === '256'){
        phoneNumber = prfx + phoneNumber.substring(3, 12);
      }
      if(cCode === '+25'){
        phoneNumber = prfx + phoneNumber.substring(4, 13);
      }
    }
    if(phoneNumber.length === 10){
      phoneNumber =  prfx + phoneNumber.substring(1, 10);
    }

    return phoneNumber;
  }
  public phoneToInternational(phoneNumber: string, prefix?: string ): string {
    let prfx = prefix ? prefix : '';
    if(phoneNumber.length === 10 && phoneNumber.substring(0, 2) == '07'){
        phoneNumber = prfx + '256' + phoneNumber.substring(1, 10);
    }
    if(phoneNumber.length === 9 && phoneNumber.substring(0, 1) == '7'){
      phoneNumber = prfx + '256' + phoneNumber.substring(1, 9);
  }
  if(phoneNumber.length === 13 && phoneNumber.substring(0, 4) == '+256'){
    phoneNumber = prfx + '256' + phoneNumber.substring(4, 13);
}
    return phoneNumber;
  }
}
