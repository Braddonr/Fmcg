export interface LoginInterface {
    data: Data;
  }
  export interface Data {
    transaction_details: TransactionDetails;
    channel_details: ChannelDetails;
  }
  export interface TransactionDetails {
    username: string;
    password: string;
    resource: string;
    url: string;
  }
  export interface ChannelDetails {
    credential: string;
    user_agent: string;
    channel: string;
  }
  