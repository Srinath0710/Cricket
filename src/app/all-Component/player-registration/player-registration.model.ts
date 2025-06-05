export class Documet{
    document_type_id:string;
  constructor(item:Partial<Documet>={}){
  this.document_type_id=item.document_type_id||'';
  }
}
export class Players{
  name:string;
  dob:string;
  nationality:string;
  batStyle:string;
  bowlSpec:string;
  status:string;
  constructor(item:Partial<Players>={}){
  this.name=item.name||'';
  this.dob=item.dob||'';
  this.nationality=item.nationality||'';
  this.batStyle=item.batStyle||'';
  this.bowlSpec=item.bowlSpec||'';
  this.status=item.status||'';
  }
}



export class playerupdate{

  user_id : string|number;
  client_id : string|number;
  first_name : string;
  middle_name : string;
  sur_name : string;
  display_name : string;
  nationality_id : string|number;
  player_dob : string;
  mobile_no : string|number;
  email : string;
  gender_id : string|number;
  player_role_id : string|number;
  batting_style_id : string|number;
  batting_order_id : string|number;
  bowling_style_id : string|number;
  bowling_type_id : string|number;
  bowling_spec_id : string|number;
  remarks : string;
  scorecard_name : string;
  jersey_no : string|number;
  profile_image : string;
  reference_id : string;
  player_id : string|number;
  // team_represent : string;
  action_flag : string;
    club_id: string|number;




          constructor(item: Partial<playerupdate> = {}) {

            this.user_id = item.user_id || 0;
            this.client_id = item.client_id || 0;
            this.first_name = item.first_name || '';
            this.middle_name = item.middle_name || '';
            this.sur_name = item.sur_name || '';
            this.display_name = item.display_name || '';
            this.nationality_id = item.nationality_id || 0;
            this.player_dob = item.player_dob || '';
            this.mobile_no = item.mobile_no || 0;
            this.email = item.email || '';
            this.gender_id = item.gender_id || 0;
            this.player_role_id = item.player_role_id || 0;
            this.batting_style_id = item.batting_style_id || 0;
            this.batting_order_id = item.batting_order_id || 0;
            this.bowling_style_id = item.bowling_style_id || 0;
            this.bowling_type_id = item.bowling_type_id || 0;
            this.bowling_spec_id = item.bowling_spec_id || 0;
            this.remarks = item.remarks || '';
            this.scorecard_name = item.scorecard_name || '';
            this.jersey_no = item.jersey_no || 0;
            this.profile_image = item.profile_image || '';
            this.reference_id = item.reference_id || '';
            this.player_id = item.player_id|| 0;
            // this.team_represent = item.team_represent || '';
            this.action_flag = item.action_flag || '';
            this.club_id = item.club_id || 0;


}
}







export class playeredit{

  user_id : string|number;
  client_id : string|number;
  first_name : string;
  middle_name : string;
  sur_name : string;
  display_name : string;
  nationality_id : string|number;
  player_dob : string;
  mobile_no : string|number;
  email : string;
  gender_id : string|number;
  player_role_id : string|number;
  batting_style_id : string|number;
  batting_order_id : string|number;
  bowling_style_id : string|number;
  bowling_type_id : string|number;
  bowling_spec_id : string|number;
  remarks : string;
  scorecard_name : string;
  jersey_no : string|number;
  profile_image : string;
  reference_id : string;
  player_id : string|number;
  // team_represent : string;
  club_id: string;




          constructor(item: Partial<playeredit> = {}) {

            this.user_id = item.user_id || 0;
            this.client_id = item.client_id || 0;
            this.first_name = item.first_name || '';
            this.middle_name = item.middle_name || '';
            this.sur_name = item.sur_name || '';
            this.display_name = item.display_name || '';
            this.nationality_id = item.nationality_id || 0;
            this.player_dob = item.player_dob || '';
            this.mobile_no = item.mobile_no || 0;
            this.email = item.email || '';
            this.gender_id = item.gender_id || 0;
            this.player_role_id = item.player_role_id || 0;
            this.batting_style_id = item.batting_style_id || 0;
            this.batting_order_id = item.batting_order_id || 0;
            this.bowling_style_id = item.bowling_style_id || 0;
            this.bowling_type_id = item.bowling_type_id || 0;
            this.bowling_spec_id = item.bowling_spec_id || 0;
            this.remarks = item.remarks || '';
            this.scorecard_name = item.scorecard_name || '';
            this.jersey_no = item.jersey_no || 0;
            this.profile_image = item.profile_image || '';
            this.reference_id = item.reference_id || '';
            this.player_id = item.player_id|| 0;
            // this.team_represent = item.team_represent || '';
              this.club_id = item.club_id || '';



}
}



export class playerspersonalupadate {
  user_id : string|number;
   client_id : string|number;
   player_id : string|number;
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
  twitter_handle: string;
  instagram_handle: string;
  facebook_url: string;
  player_height: string;
  player_weight: string;
  medical_conditions: string;
  allergies: string;
  medications: string;
  doctor_name: string;
  doctor_phone: string;
  insurance_provider: string;
  policy_number: string;
  policy_expiry_date: string;
  additional_notes: string;
  
  

  constructor(item: Partial<playerspersonalupadate> = {}) {
     this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.player_id = item.player_id || 0;
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
    this.twitter_handle = item.twitter_handle || '';
    this.instagram_handle = item.instagram_handle || '';
    this.facebook_url = item.facebook_url || '';
    this.player_height = item.player_height || '';
    this.player_weight = item.player_weight || '';
    this.medical_conditions = item.medical_conditions || '';
    this.allergies = item.allergies || '';
    this.medications = item.medications || '';
    this.doctor_name = item.doctor_name || '';
    this.doctor_phone = item.doctor_phone || '';
    this.insurance_provider = item.insurance_provider || '';
    this.policy_number = item.policy_number || '';
    this.policy_expiry_date = item.policy_expiry_date || '';
    this.additional_notes = item.additional_notes || '';
  }
}






export class playersPersonalEdit {
  user_id : string|number;
   client_id : string|number;
   player_id : string|number;
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
  twitter_handle: string;
  instagram_handle: string;
  facebook_url: string;
  player_height: string;
  player_weight: string;
  medical_conditions: string;
  allergies: string;
  medications: string;
  doctor_name: string;
  doctor_phone: string;
  insurance_provider: string;
  policy_number: string;
  policy_expiry_date:string;
  additional_notes: string;
  
  

  constructor(item: Partial<playersPersonalEdit> = {}) {
     this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.player_id = item.player_id || 0;
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
    this.twitter_handle = item.twitter_handle || '';
    this.instagram_handle = item.instagram_handle || '';
    this.facebook_url = item.facebook_url || '';
    this.player_height = item.player_height || '';
    this.player_weight = item.player_weight || '';
    this.medical_conditions = item.medical_conditions || '';
    this.allergies = item.allergies || '';
    this.medications = item.medications || '';
    this.doctor_name = item.doctor_name || '';
    this.doctor_phone = item.doctor_phone || '';
    this.insurance_provider = item.insurance_provider || '';
    this.policy_number = item.policy_number || '';
    this.policy_expiry_date = item.policy_expiry_date || '';
    this.additional_notes = item.additional_notes || '';
  }
}
