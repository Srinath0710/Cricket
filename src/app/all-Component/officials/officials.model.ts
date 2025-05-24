export class Documet{
    document_type_id:string;
  constructor(item:Partial<Documet>={}){
  this.document_type_id=item.document_type_id||'';
  }
}
export class officials{
  name:string;
  dob:string;
  nationality:string;
  batStyle:string;
  bowlSpec:string;
  status:string;
  constructor(item:Partial<officials>={}){
  this.name=item.name||'';
  this.dob=item.dob||'';
  this.nationality=item.nationality||'';
  this.batStyle=item.batStyle||'';
  this.bowlSpec=item.bowlSpec||'';
  this.status=item.status||'';
  }
}


export class officiallist{

user_id: |number;
  client_id: number;
  page_no: number;
  records: number;

  constructor(item: Partial<officiallist> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.page_no = item.page_no || 0;
    this.records = item.records || 0;

  }

}


export class offcialedit{

  user_id : number;
  client_id : number;
  first_name : string;
  middle_name : string;
  sur_name : string;
  display_name : string;
  format_id : number;
  official_category_id : number;
  profile_img: string;
  country_id : number;
  official_type_id:number;
  official_id:string|number;
  reference_id:string|number;
  


  
  constructor(item: Partial<offcialedit> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.first_name = item.first_name || '';
    this.middle_name = item.middle_name || '';
    this.sur_name = item.sur_name || '';
    this.display_name = item.display_name || '';
    this.format_id = item.format_id || 0;
    this.official_category_id = item.official_category_id || 0;
    this.profile_img = item.profile_img || '';
    this.country_id = item.country_id || 0;
    this.official_type_id = item.official_type_id || 0;
    this.official_id = item.official_id || 0;
    this.reference_id = item.reference_id || 0;
   

  }
}




export class offcialupdate{

  user_id : string|number;
  client_id : string|number;
  first_name : string;
  middle_name : string;
  sur_name : string;
  display_name : string;
  format_id : string|number;
  official_type_id :string|number;
  official_category_id : string|number;
  country_id : string|number;
  profile_img : string;
  official_id : string|number;
  reference_id : string|number;
  action_flag: string;


  constructor(item: Partial<offcialupdate> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.first_name = item.first_name || '';
    this.middle_name = item.middle_name || '';
    this.sur_name = item.sur_name || '';
    this.display_name = item.display_name || '';
    this.format_id = item.format_id || '';
    this.official_type_id = item.official_type_id || 0;
    this.official_category_id = item.official_category_id || 0;
    this.country_id = item.country_id || 0;
    this.profile_img = item.profile_img || '';
   this.official_id=item.official_id||0;
   this.reference_id=item.reference_id||0;
   this.action_flag=item.action_flag||'';



}
}