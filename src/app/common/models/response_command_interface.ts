export class ResponseCommandInterface {
    response: Response = new Response();
    data: Data = new Data();
    constructor(values: Object = {}) {
      Object.assign(this, values);
    }
  }
  export class Response {
    response_code: string;
    response_message: string;
    error: string;
    constructor() {
      this.response_code = '';
      this.response_message = '';
      this.error = '';
    }
  }
  export class Data {
    user: UserDetails;
    roles: string[];
    permissions: string[];
    profiles: string[];
    access_token: string;
    refresh_token: string;
    constructor(values: Object = {}) {
      Object.assign(this, values);
      this.user = {
        type: 'user_account',
        accounts: null,
        username: '',
        login_trials: 0,
        email_address: '',
        first_name: '',
        middle_name: '',
        surname: null,
        account_status: '1',
        phone_number: null,
        customer_number: null
      };
      this.roles = ['module_users', 'module_customers', 'module_profiles' ];
      this.permissions = [];
      this.profiles = ['admin'];
      this.access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzM4NCJ9.eyJ0eXBlIjoidXNlcl9hY2NvdW50Iiwic3ViIjoibmp1Z3VuYSIsInBob25lX251bWJlciI6bnVsbCwiY3VzdG9tZXJfbnVtYmVyIjpudWxsLCJqdGkiOiIzUXhvZkZ6UHdxV3hwYjdYIiwiZXhwIjoxNTkxMTY1MjEzfQ.H5rsKiBsYLb5MaAQSM3JBib8EkXMJCumlpwobTrwT2ytMO0gHb0PVXBLFo8NeDFM5LGF4UMoZXjj5sNCEoTyZlB4EjVoTYKVh55LoVk-BpPV1wK2g8Z5zaqdX_j3USX-Jx2pT0o7sM-DgAxc43D0PLCZh3LAXQb8_2v5Su-2YqM';
      this.refresh_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzM4NCJ9.eyJ0eXBlIjoidXNlcl9hY2NvdW50Iiwic3ViIjoibmp1Z3VuYSIsInBob25lX251bWJlciI6bnVsbCwiY3VzdG9tZXJfbnVtYmVyIjpudWxsLCJqdGkiOiI0am03eHZVMmg5amlOZm1tIiwiZXhwIjoxNTkxMTYwMDMwfQ.pXcWFybcmkINRuaWaTE3oEYHsR31jZWFaChT781tLpxI31HSAPwYmW3W9dxRM4kiExGzISfqP49N_ZKApDX_hr5mDO1tI9QM1mYZrLAI9ib2lDa-lC7KP7sQOMfblAEwr6vQ4Ntiqbh1moz9RiwfqmoZylK1J4Gmv3Vex6180zU';
    }
  }
  export interface UserDetails {
    type: string;
    accounts: string;
    username: string;
    login_trials: number;
    email_address: string;
    first_name: string;
    middle_name: string;
    surname: string;
    account_status: string;
    phone_number: string;
    customer_number: string;
  }
  
  
  
  
  