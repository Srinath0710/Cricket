export class City {
user_id:number;
client_id:number;
state_id:number;
page_no:number;
record_status: string;

   constructor(item: Partial<City> = {}){
    this.user_id=item.user_id||0;
    this.state_id=item.state_id||0;
    this.client_id=item.client_id||0;
    this.page_no=item.page_no||0;
    this.record_status = item.record_status || '';
   }

}
export class getCityList{
  user_id: string|number;
  client_id: string|number;
  state_id:string|number;
  page_no:string|number;
  records:string|number;
  region_id:string|number;
  record_status: string|number;
  

   constructor(item: Partial<getCityList> = {}){
    this.user_id=item.user_id||0;
    this.state_id=item.state_id||0;
    this.client_id=item.client_id||0;
    this.page_no=item.page_no||0;
    this.records=item.records||0;
    this.region_id=item.region_id||0;
    this.record_status = item.record_status || '';


}
}
export class UpdateCity{
    user_id:String|number;
    client_id:string|number;
    state_id:string|number;
    city_name:string;
    city_code:string|number;
    city_id:string|number;
    action_flag: string;
    capital: string;
    phonecode: string|number;

    constructor(item: Partial<UpdateCity> = {}){
      this.user_id=item.user_id||0;
      this.state_id=item.state_id||0;
      this.client_id=item.client_id||0;
      this.city_name=item.city_name||'';
      this.city_code=item.city_code||0;
      this.city_id=item.city_id||0;
      this.action_flag = item.action_flag || '';
      this.capital = item.capital || '';
      this.phonecode = item.phonecode || 0;



    }

}

export class Country{
    user_id:String|number;
    client_id:string|number;
  country_id: any;

    constructor(item: Partial<Country> = {}){
      this.user_id=item.user_id||0;
      this.client_id=item.client_id||0;

    }


}
export class State{
    user_id:String|number;
    client_id:string|number;
    country_id: number;

    constructor(item: Partial<State> = {}){
      this.user_id=item.user_id||0;
      this.client_id=item.client_id||0;
      this.country_id = item.country_id || 0;

    }


}




