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
   club_id: string;
      gender_id: string|number;
   dob:string;

  


  
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
       this.club_id = item.club_id || '';
         this.gender_id = item.gender_id || 0;
     this.dob = item.dob || ''
   

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
   club_id: string|number;
   gender_id: string|number;
   dob:string;


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
   this.club_id = item.club_id || 0;
    this.gender_id = item.gender_id || 0;
     this.dob = item.dob || '';
 



}
}


export class offcialpersonalupadate {
  user_id : string|number;
   client_id : string|number;
   official_id : string|number;
  nationality_id: number|string;
  country_of_birth: number|string;
  residence_country_id: number|string;
  primary_email_id: string;
  secondary_email_id: string;
  primary_phone: string;
  secondary_phone: string;
  blood_group_id: number|string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address_1: string;
  address_2: string;
  country_id: number|string;
  state_id: number|string;
  city_id: number|string;
  post_code: string;
  emergency_contact: string;
  emergency_type: string;
  emergency_number: string;
  emergency_email: string;
  profile_status_id:number|string;
  accreditation_level_id: number|string;
  accreditation_id: number|string;
  accreditation_expiry_date: number|string;
  years_of_experience: number|string;
  twitter_handle: string;
  instagram_handle: string;
  facebook_url: string;
  // action_flag:string;
  

  constructor(item: Partial<offcialpersonalupadate> = {}) {
     this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.official_id = item.official_id || 0;
    this.nationality_id = item.nationality_id || '';
    this.country_of_birth = item.country_of_birth || '';
    this.residence_country_id = item.residence_country_id || '';
    this.primary_email_id = item.primary_email_id || '';
    this.secondary_email_id = item.secondary_email_id || '';
    this.primary_phone = item.primary_phone || '';
    this.secondary_phone = item.secondary_phone || '';
    this.blood_group_id = item.blood_group_id || '';
    this.father_name = item.father_name || '';
    this.mother_name = item.mother_name || '';
    this.guardian_name = item.guardian_name || '';
    this.address_1 = item.address_1 || '';
    this.address_2 = item.address_2 || '';
    this.country_id = item.country_id || '';
    this.state_id = item.state_id || '';
    this.city_id = item.city_id || '';
    this.post_code = item.post_code || '';
    this.emergency_contact = item.emergency_contact || '';
    this.emergency_type = item.emergency_type || '';
    this.emergency_number = item.emergency_number || '';
    this.emergency_email = item.emergency_email || '';
    this.profile_status_id = item.profile_status_id || '';
    this.accreditation_level_id = item.accreditation_level_id || '';
    this.accreditation_id = item.accreditation_id || '';
    this.accreditation_expiry_date = item.accreditation_expiry_date || '';
    this.years_of_experience = item.years_of_experience || '';
    this.twitter_handle = item.twitter_handle || '';
    this.instagram_handle = item.instagram_handle || '';
    this.facebook_url = item.facebook_url || '';
    // this.action_flag = item.action_flag || '';
  }
}






export class offcialpersonaledit{
  user_id : string|number;
   client_id : string|number;
   official_id : string|number;
  nationality_id: number|string;
  country_of_birth: number|string;
  residence_country_id: number|string;
  primary_email_id: string;
  secondary_email_id: string;
  primary_phone: string;
  secondary_phone: string;
  blood_group_id: number|string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  address_1: string;
  address_2: string;
  country_id: number|string;
  state_id: number|string;
  city_id: number|string;
  post_code: string;
  emergency_contact: string;
  emergency_type:string;
  emergency_number: string;
  emergency_email: string;
  profile_status_id:number|string;
  accreditation_level_id: number|string;
  accreditation_id: number|string;
  accreditation_expiry_date: string;
  years_of_experience: number|string;
  twitter_handle: string;
  instagram_handle: string;
  facebook_url: string;
  // action_flag: string;
  

  constructor(item: Partial<offcialpersonaledit> = {}) {
     this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.official_id = item.official_id || 0;
    this.nationality_id = item.nationality_id || '';
    this.country_of_birth = item.country_of_birth || '';
    this.residence_country_id = item.residence_country_id || '';
    this.primary_email_id = item.primary_email_id || '';
    this.secondary_email_id = item.secondary_email_id || '';
    this.primary_phone = item.primary_phone || '';
    this.secondary_phone = item.secondary_phone || '';
    this.blood_group_id = item.blood_group_id || '';
    this.father_name = item.father_name || '';
    this.mother_name = item.mother_name || '';
    this.guardian_name = item.guardian_name || '';
    this.address_1 = item.address_1 || '';
    this.address_2 = item.address_2 || '';
    this.country_id = item.country_id || '';
    this.state_id = item.state_id || '';
    this.city_id = item.city_id || '';
    this.post_code = item.post_code || '';
    this.emergency_contact = item.emergency_contact || '';
    this.emergency_type = item.emergency_type || '';
    this.emergency_number = item.emergency_number || '';
    this.emergency_email = item.emergency_email || '';
    this.profile_status_id = item.profile_status_id || '';
    this.accreditation_level_id = item.accreditation_level_id || '';
    this.accreditation_id = item.accreditation_id || '';
    this.accreditation_expiry_date = item.accreditation_expiry_date || '';
    this.years_of_experience = item.years_of_experience || '';
    this.twitter_handle = item.twitter_handle || '';
    this.instagram_handle = item.instagram_handle || '';
    this.facebook_url = item.facebook_url || '';
    // this.action_flag = item.action_flag || '';
  }
}


