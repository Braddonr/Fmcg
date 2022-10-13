export class QueryCommandInterface {
    data: Data = new Data();
    upload_data: string;
    upload_name: string;
    content_type: string;
  
  
  }
  export class Data {
    transaction_details: any;
    channel_details: ChannelDetails;
    constructor(values: Object = {}) {
      Object.assign(this, values);
      this.channel_details = {
        credential: 'jsjhvucguggdfifdiuhfdi',
        user_agent: 'Mozilla',
        channel: 'WEB_PORTAL',
      };
    }
  }
  export interface ChannelDetails {
    credential: string;
    user_agent: string;
    channel: string;
  }
  export class Pagination {
    order: string;
    sort_params: string[];
    size: number;
    current_page: number;
    constructor() {
      this.sort_params = ['id'];
      this.order = 'DESC';
      this.size = 200;
      this.current_page = 0;
    }
  }
  
  export class Paginations {
    order: string;
    sort_filters: string[];
    size: number;
    page: number;
    constructor() {
      this.sort_filters = [];
      this.order = 'DESC';
      this.size = 100;
      this.page = 0;
    }
  }
  
  
  
  