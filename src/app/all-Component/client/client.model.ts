export class Client {
    client_id: string|number;
    Client: string;
    country: string;
    state: string;
    city: string;
    address_1: string;
    address_2: string;
    post_code: number;
    email_id: string;
    mobile: number;
    website: string;
    record_status: string;
    profile_img_url: string;

  
    constructor(item: Partial<Client> = {}) {
      this.client_id = item.client_id || '';
      this.Client = item.Client || '';
      this.country = item.country || '';
      this.state = item.state || '';
      this.city = item.city || '';
      this.address_1 = item.address_1 || '';
      this.address_2 = item.address_2 || '';
      this.post_code = item.post_code || 0;
      this.email_id = item.email_id || '';
      this.mobile = item.mobile || 0;
      this.website = item.website || '';
      this.record_status = item.record_status || '';
      this.profile_img_url = item.profile_img_url || '';
    }
  }
  export class EditClient {
    client_id: string|number;
    client_name: String;
    client_code: String;
    country_id: string|number;
    address_1: String;
    address_2: String;
    state_id: string|number;
    city_id: string|number;
    post_code: number;
    email_id: string|number;
    mobile: number;
    website: string;
    description: string;
    connection_id: string|number;
    profile_img_url:string;

  
    constructor(item: Partial<EditClient> = {}) {
      this.client_id = item.client_id || '';
      this.client_name = item.client_name ||'';
      this.client_code = item.client_code ||'';
      this.country_id = item.country_id ||'';
      this.address_1 = item.address_1 ||'';
      this.address_2 = item.address_2 ||'';
      this.state_id = item.state_id ||'';
      this.city_id = item.city_id ||'';
      this.post_code = item.post_code ||0;
      this.mobile = item.mobile ||0;
      this.email_id = item.email_id ||'';
      this.website = item.website ||'';
      this.description = item.description ||'';
      this.connection_id = item.connection_id ||'';
      this.profile_img_url = item.profile_img_url ||'';

  
    }
  }
  export class UpdateClient {
    user_id: string|number;
    client_id?: string|number;
    client_name: string;
    action_flag: string;
    address_1: string;
    address_2: string;
    post_code: string;
    email_id: string;
    mobile: string;
    website: string;
    description: string;
    client_code: string;
    state_id: string|number;
    country_id: string|number;
    city_id: string|number;
    header_color: string;
    tbl_header_color: string;
    button_color: string;
    button_font_color: string;
    connection_id: string;
    tbl_header_font_color: string;
    profile_img_url: string;

  
    constructor(item: Partial<UpdateClient> = {}) {
      this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.client_name = item.client_name || '';
      this.action_flag = item.action_flag || '';
      this.address_1 = item.address_1 || '';
      this.address_2 = item.address_2 || '';
      this.post_code = item.post_code || '';
      this.email_id = item.email_id || '';
      this.mobile = item.mobile || '';
      this.website = item.website || '';
      this.description = item.description || '';
      this.client_code = item.client_code || '';
      this.state_id = item.state_id || '';
      this.country_id = item.country_id || '';
      this.city_id = item.city_id || '';
      this.header_color = item.header_color || '';
      this.tbl_header_color = item.tbl_header_color || '';
      this.button_color = item.button_color || '';
      this.button_font_color = item.button_font_color || '';
      this.connection_id = item.connection_id || '';
      this.tbl_header_font_color = item.tbl_header_font_color || '';
      this.profile_img_url = item.profile_img_url || '';
    
  
    }
  }