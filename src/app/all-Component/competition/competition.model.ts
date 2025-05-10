
export interface Compitition {
  competition_id: number;
  client_id: number;
  season_name: string;
  start_date: string;
  end_date: string;
  comp_date: string;
  competition_name: string;
  visual_name: string;
  trophy_name: string;
  format: string;
  tour_type: string;
  category: string;
  age_category: string;
  gender: string;
  record_status: string;
  profile_image: string;
  total_records: number;
  
  
  name?: string;
  match_type?: string;
  status?: string;
  imageUrl?: string;
}


export class UpdateCompetition {
  user_id: string|number;
  client_id: string|number;
  season_id: string|number;
  competition_name: string;
  visual_name : string;
  trophy_name: string;
  competition_type_id: string|number;
  competition_category_id: string|number;
  gender_id: string|number;
  age_category_id: string|number;
  competition_level: string;
  competition_format_id: string|number;
  start_date: string|number;
  end_date: string|number;
  // is_practice: string|number;
  video_path: string|number;
  overs_per_innings: string|number;
  overs_per_bowler: string|number;
  points_abandoned: string|number;
  points_draw: string|number;
  points_win: string|number;
  points_lead: string|number;
  points_tie: string|number;
  calculation: string|number;
  competition_id: string|number;
  action_flag: string;

  // competition_image: null;

  constructor(item: Partial<UpdateCompetition> = {}) {
    this.user_id = item.user_id || 0;
    this.competition_id = item.competition_id || '';
    this.client_id = item.client_id || 0;
    this.season_id = item.season_id || '';
    this.competition_name = item.competition_name || '';
    this.visual_name = item.visual_name || '';
    this.trophy_name = item.trophy_name || '';
    this.competition_type_id = item.competition_type_id || 0;
    this.competition_category_id = item.competition_category_id ||'';
    this.age_category_id = item.age_category_id || '';
    this.competition_level = item.competition_level || '';
    this.gender_id = item.gender_id || 0;
    this.competition_format_id = item.competition_format_id || 0;
    this.start_date = item.start_date || 0;
    this.end_date = item.end_date || 0;
    // this.is_practice = item.is_practice || 0;
    this.video_path = item.video_path || 0;
    this.overs_per_innings = item.overs_per_innings || 0;
    this.overs_per_bowler = item.overs_per_bowler || 0;
    this.points_abandoned = item.points_abandoned || 0;
    this.points_draw = item.points_draw || 0;
    this.points_win = item.points_win || 0;
    this.points_lead = item.points_lead || 0;
    this.points_tie = item.points_tie || 0;
    this.calculation = item.calculation || 0;
    this.action_flag = item.action_flag || '';

  }
}
export class EditCompitition {
  competition_id: number;
  season_id: string|Number;
  competition_name: string;
  visual_name: string;
  trophy_name: string;
  competition_type_id: string|Number;
  competition_category_id: string|Number;
  gender_id: string|Number;
  age_category_id: string|Number;
  competition_format_id: string|Number;
  competition_level: string;
  start_date: string;
  end_date: string;
  video_path: String;
  overs_per_innings: number;
  overs_per_bowler: number;
  points_abandoned: number;
  points_draw: number;
  points_win: number;
  points_lead: number;
  points_tie: number;
  calculation: number;
  competition_image: string;
  distrib_id:string;
  is_practice:string;

  constructor(item: Partial<EditCompitition> = {}) {
    this.competition_id = item.competition_id || 0;
    this.season_id = item.season_id || '';
    this.competition_name = item.competition_name || '';
    this.visual_name = item.visual_name || '';
    this.trophy_name = item.trophy_name || '';
    this.competition_type_id = item.competition_type_id || '';
    this.competition_category_id = item.competition_category_id || '';
    this.gender_id = item.gender_id || '';
    this.age_category_id = item.age_category_id || '';
    this.competition_level = item.competition_level || '';
    this.competition_format_id = item.competition_format_id || '';
    this.start_date = item.start_date || '';
    this.end_date = item.end_date || '';
    this.video_path = item.video_path || '';
    this.overs_per_innings = item.overs_per_innings || 0;
    this.overs_per_bowler = item.overs_per_bowler || 0;
    this.points_abandoned = item.points_abandoned || 0;
    this.points_draw = item.points_draw || 0;
    this.points_win = item.points_win || 0;
    this.points_lead = item.points_lead || 0;
    this.points_tie = item.points_tie || 0;
    this.calculation = item.calculation || 0;
    this.competition_image = item.competition_image || '';
    this.distrib_id = item.distrib_id || '';
    this.is_practice = item.is_practice || '';

  }
}