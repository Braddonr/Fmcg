export interface PasswordResetInterface {
    txntimestamp: string;
    data: Data;
    xref: string;
  }
  export interface Data {
    transaction_details: TransactionDetails;
    channel_details: ChannelDetails;
  }
  export interface TransactionDetails {
    account_type: String;
    account: string;
    req_type: string;
  }
  export interface ChannelDetails {
    channel_key: String;
    host: string;
    geolocation: string;
    user_agent_version: string;
    user_agent: string;
    client_id: string;
    channel: string;
  }

