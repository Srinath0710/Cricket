export class Teams {
  team_id: number;
  team_name: string;
  gender: string;
  age_category: string;
  team_category: string;
  record_status: string;
  team_short: any;
  // time_zone_name: number;

  constructor(item: Partial<Teams> = {}) {
    this.team_id = item.team_id || 0;
    this.team_name = item.team_name || '';
    this.gender = item.gender || '';
    this.age_category = item.age_category || '';
    this.team_category = item.team_category || '';
    this.record_status = item.record_status || '';

  }
}

export class EditTeam {
  team_id: number;
  team_short: string;
  team_name: string;
  gender_id: number;
  age_category_id: number;
  format_id: number;
  primary_color: string;
  secondary_color: string;
  distrib_id: number;
  club_id: string;
  reference_id: number;
  country_id: string;
  profile_img: string;


  constructor(item: Partial<EditTeam> = {}) {
    this.team_id = item.team_id || 0;
    this.team_short = item.team_short || '';
    this.gender_id = item.gender_id || 0;
    this.team_name = item.team_name || '';
    this.age_category_id = item.age_category_id || 0;
    this.primary_color = item.primary_color || '';
    this.secondary_color = item.secondary_color || '';
    this.format_id = item.format_id || 0;
    this.distrib_id = item.distrib_id || 0;
    this.club_id = item.club_id || '';
    this.reference_id = item.reference_id || 0;
    this.country_id = item.country_id || '';
    this.profile_img = item.profile_img || '';
     }
}

export class UpdateTeams {
    user_id: string|number;
    client_id: string|number;
    gender_id: string|number;
    age_category_id: string|number;
    format_id: string|number;
    team_id?: string|number;
    team_name: string;
    team_short: string;
     club_id: string|number;
     reference_id: string|number;
     country_id:string|number;
    action_flag: string;
    profile_img : string;

  
    constructor(item: Partial<UpdateTeams> = {}) {
      this.user_id = item.user_id || 0;
      this.client_id = item.client_id || 0;
      this.gender_id = item.gender_id || '';
      this.team_name = item.team_name || '';
      this.team_short = item.team_short || '';
      this.age_category_id = item.age_category_id || 0;
      this.format_id = item.format_id || 0;
      this.team_id = item.team_id || 0;
      this.club_id = item.club_id || 0;
      this.reference_id = item.reference_id || 0;
      this.country_id = item.country_id || '';
      this.action_flag = item.action_flag || '';
      this.profile_img = item.profile_img || '';

    }
  }