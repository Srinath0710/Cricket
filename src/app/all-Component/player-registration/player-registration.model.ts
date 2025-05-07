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
  jersey_no : string|number;
  profile_image : string;
  player_id : string|number;
  team_represent : string;
  action_flag : string;




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
            this.jersey_no = item.jersey_no || 0;
            this.profile_image = item.profile_image || '';
            this.player_id = item.player_id|| 0;
            this.team_represent = item.team_represent || '';
            this.action_flag = item.action_flag || '';



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
  jersey_no : string|number;
  profile_image : string;
  player_id : string|number;
  team_represent : string;




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
            this.jersey_no = item.jersey_no || 0;
            this.profile_image = item.profile_image || '';
            this.player_id = item.player_id|| 0;
            this.team_represent = item.team_represent || '';



}
}



