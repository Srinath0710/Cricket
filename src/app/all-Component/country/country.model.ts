export class Country {
    country_id: number;
    iso_code_3: string;
    iso_code_2: string;
    country_name: string;
    region_name: string;
    sub_region: string;
    capital: string;
    time_zone_name: string;
    record_status: string;
    // time_zone_name: number;
    country_image:string
  
    constructor(item: Partial<Country> = {}) {
      this.country_id = item.country_id || 0;
      this.iso_code_3 = item.iso_code_3 || '';
      this.iso_code_2 = item.iso_code_2 || '';
      this.country_name = item.country_name || '';
      this.region_name = item.region_name || '';
      this.sub_region = item.sub_region || '';
      this.capital = item.capital || '';
      this.time_zone_name = item.time_zone_name || '';
      this.record_status = item.record_status || '';
      this.country_image = item.country_image || '';
  
    }
  }
  export class CountryList {
    user_id: string|number;
    client_id: string|number;
    country_id:string|number;
     country_image:string
  
    constructor(item: Partial<CountryList> = {}) {
      this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.country_id = item.country_id || 0;
      this.country_image = item.country_image || '';
    }

  }

export class EditCountry {
    country_id: number;
    iso_code_3: string;
    iso_code_2: string;
    country_name: string;
    region_id: number;
    sub_region: string;
    capital: string;
    time_zone_id: number;
    phonecode: number;
    country_image:string
  
    constructor(item: Partial<EditCountry> = {}) {
      this.country_id = item.country_id || 0;
      this.iso_code_3 = item.iso_code_3 || '';
      this.iso_code_2 = item.iso_code_2 || '';
      this.country_name = item.country_name || '';
      this.region_id = item.region_id || 0;
      this.phonecode = item.phonecode || 0;
      this.sub_region = item.sub_region || '';
      this.capital = item.capital || '';
      this.time_zone_id = item.time_zone_id || 0;
       this.country_image = item.country_image || ''; 
  
    }
  }
export class UpdateCountry {
    user_id: string|number;
    client_id: string|number;
    country_id: string|number;
    iso_code_3: string;
    action_flag: string;
    iso_code_2: string;
    country_name: string;
    region_id: string|number;
    sub_region: string;
    capital: string;
    time_zone_id: string|number;
    phonecode: string|number;
    
   country_image:string
  
    constructor(item: Partial<UpdateCountry> = {}) {
      this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.country_id = item.country_id || 0;
      this.action_flag = item.action_flag || '';
      this.iso_code_2 = item.iso_code_2 || '';
      this.iso_code_3 = item.iso_code_3 || '';
      this.country_name = item.country_name || '';
      this.region_id = item.region_id || 0;
      this.phonecode = item.phonecode || 0;
      this.sub_region = item.sub_region || '';
      this.capital = item.capital || '';
      this.time_zone_id = item.time_zone_id || 0;
     this.country_image = item.country_image || '';
  
    }
  }