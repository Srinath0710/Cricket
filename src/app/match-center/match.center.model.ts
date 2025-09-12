//Filter Model
export class FilterMatchModel {
  config_value: string;
  config_key: string;
  parent_config_id?: number;
  matchType: any;

  constructor(item: Partial<FilterMatchModel> = {}) {
    this.config_value = item.config_value || '';
    this.config_key = item.config_key || '';
    this.parent_config_id = item.parent_config_id ? Number(item.parent_config_id) : undefined;
  }
}

//Compitation Model
export class CompetitionModel {
  end_date: string;
  team_format: string;
  gender: string;
  season_id: number;
  age_category: string;
  completed: string;
  gender_id: string;
  client_id: number;
  competition_name: string;
  competition_id: number;
  comp_type_id: number;
  age_category_id: number;
  comp_type: string;
  live: string;
  upcoming: string;
  start_date: string;
  total_matches: number;
  status: string;

  constructor(item: Partial<CompetitionModel> = {}) {
    this.end_date = item.end_date || '';
    this.team_format = item.team_format || '';
    this.gender = item.gender || '';
    this.season_id = item.season_id || 0;
    this.age_category = item.age_category || '';
    this.completed = item.completed || '';
    this.gender_id = item.gender_id || '';
    this.client_id = item.client_id || 0;
    this.competition_name = item.competition_name || '';
    this.competition_id = item.competition_id || 0;
    this.comp_type_id = item.comp_type_id || 0;
    this.age_category_id = item.age_category_id || 0;
    this.comp_type = item.comp_type || '';
    this.live = item.live || '';
    this.upcoming = item.upcoming || '';
    this.start_date = item.start_date || '';
    this.total_matches = item.total_matches || 0;
    this.status = item.status || '';
  }
}
export interface InningsData {
  runs: string;
  overs: string;
}
//Match Summary Model
export class MatchSummaryModel {
  team_format: string;
  venue: string;
  match_start_date: string;
  team_2_summary: InningsData[] | null;
  current_innings_no: string;
  team_2_name: string;
  gender: string;
  match_id: number;
  team_1_summary: InningsData[] | null;
  match_no: string;
  age_category: string;
  time_zone: string;
  client_id: number;
  competition_name: string;
  competition_id: number;
  match_result: string;
  comp_type: string;
  match_end_date: string;
  team_1_name: string;

  constructor(item: Partial<MatchSummaryModel> = {}) {
    this.team_format = item.team_format || '';
    this.venue = item.venue || '';
    this.match_start_date = item.match_start_date || '';
    this.team_2_summary = item.team_2_summary ?? null;
    this.current_innings_no = item.current_innings_no || '';
    this.team_2_name = item.team_2_name || '';
    this.gender = item.gender || '';
    this.match_id = item.match_id || 0;
    this.team_1_summary = item.team_1_summary ?? null;
    this.match_no = item.match_no || '';
    this.age_category = item.age_category || '';
    this.time_zone = item.time_zone || '';
    this.client_id = item.client_id || 0;
    this.competition_name = item.competition_name || '';
    this.competition_id = item.competition_id || 0;
    this.match_result = item.match_result || '';
    this.comp_type = item.comp_type || '';
    this.match_end_date = item.match_end_date || '';
    this.team_1_name = item.team_1_name || '';
  }
}


// Scedule Model
export class ScheduleModel {
  team_format: string;
  venue: string;
  match_start_date: string;
  team_2_summary: string;
  team_2_name: string;
  gender: string;
  match_id: number;
  team_1_summary: string;
  match_no: string;
  age_category: string;
  time_zone: string;
  client_id: number;
  competition_name: string;
  competition_id: number;
  match_result: string;
  comp_type: string;
  match_end_date: string;
  team_1_name: string;

  constructor(item: Partial<ScheduleModel> = {}) {
    this.team_format = item.team_format || '';
    this.venue = item.venue || '';
    this.match_start_date = item.match_start_date || '';
    this.team_2_summary = item.team_2_summary || '';
    this.team_2_name = item.team_2_name || '';
    this.gender = item.gender || '';
    this.match_id = item.match_id ? Number(item.match_id) : 0;
    this.team_1_summary = item.team_1_summary || '';
    this.match_no = item.match_no || '';
    this.age_category = item.age_category || '';
    this.time_zone = item.time_zone || '';
    this.client_id = item.client_id ? Number(item.client_id) : 0;
    this.competition_name = item.competition_name || '';
    this.competition_id = item.competition_id ? Number(item.competition_id) : 0;
    this.match_result = item.match_result || '';
    this.comp_type = item.comp_type || '';
    this.match_end_date = item.match_end_date || '';
    this.team_1_name = item.team_1_name || '';
  }
}

//Battng Summary Model
export class BattingSummaryModel {
  dot_balls: number;
  balls: number;
  match_id: number;
  innings_no: number;
  bdry_six: number;
  client_id: number;
  bdry_four: number;
  batting_order: number;
  strike_rate: number;
  player_id: number;
  wicket_desc: string | null;
  scoring_balls: number;
  competition_id: number;
  batting_team: string;
  player_name: string;
  runs: number;

  constructor(item: Partial<BattingSummaryModel> = {}) {
    this.dot_balls = item.dot_balls ? Number(item.dot_balls) : 0;
    this.balls = item.balls ? Number(item.balls) : 0;
    this.match_id = item.match_id ? Number(item.match_id) : 0;
    this.innings_no = item.innings_no ? Number(item.innings_no) : 0;
    this.bdry_six = item.bdry_six ? Number(item.bdry_six) : 0;
    this.client_id = item.client_id ? Number(item.client_id) : 0;
    this.bdry_four = item.bdry_four ? Number(item.bdry_four) : 0;
    this.batting_order = item.batting_order ? Number(item.batting_order) : 0;
    this.strike_rate = item.strike_rate ? Number(item.strike_rate) : 0;
    this.player_id = item.player_id ? Number(item.player_id) : 0;
    this.wicket_desc = item.wicket_desc || null;
    this.scoring_balls = item.scoring_balls ? Number(item.scoring_balls) : 0;
    this.competition_id = item.competition_id ? Number(item.competition_id) : 0;
    this.batting_team = item.batting_team || '';
    this.player_name = item.player_name || '';
    this.runs = item.runs ? Number(item.runs) : 0;
  }
}

//Bowling Summary
export class BowlingSummaryModel {
  dot_balls: number;
  match_id: number;
  innings_no: number;
  economy: number;
  overs: number;
  bdry_six: number;
  client_id: number;
  bdry_four: number;
  wicket: number;
  strike_rate: number;
  player_id: number;
  bowling_order: number;
  competition_id: number;
  bowling_team: string;
  maidens: number;
  player_name: string;
  runs: number;

  constructor(item: Partial<BowlingSummaryModel> = {}) {
    this.dot_balls = item.dot_balls ? Number(item.dot_balls) : 0;
    this.match_id = item.match_id ? Number(item.match_id) : 0;
    this.innings_no = item.innings_no ? Number(item.innings_no) : 0;
    this.economy = item.economy ? Number(item.economy) : 0;
    this.overs = item.overs ? Number(item.overs) : 0;
    this.bdry_six = item.bdry_six ? Number(item.bdry_six) : 0;
    this.client_id = item.client_id ? Number(item.client_id) : 0;
    this.bdry_four = item.bdry_four ? Number(item.bdry_four) : 0;
    this.wicket = item.wicket ? Number(item.wicket) : 0;
    this.strike_rate = item.strike_rate ? Number(item.strike_rate) : 0;
    this.player_id = item.player_id ? Number(item.player_id) : 0;
    this.bowling_order = item.bowling_order ? Number(item.bowling_order) : 0;
    this.competition_id = item.competition_id ? Number(item.competition_id) : 0;
    this.bowling_team = item.bowling_team || '';
    this.maidens = item.maidens ? Number(item.maidens) : 0;
    this.player_name = item.player_name || '';
    this.runs = item.runs ? Number(item.runs) : 0;
  }
}

//Fall Of Wickets
export class FallOfWicketModel {
  team_total: number;
  player_id: number;
  wicket_desc: string;
  competition_id: number;
  batting_team: string;
  match_id: number;
  wicket_no: number;
  innings_no: number;
  player_name: string;
  client_id: number;
  over_value: number;

  constructor(item: Partial<FallOfWicketModel> = {}) {
    this.team_total = item.team_total ? Number(item.team_total) : 0;
    this.player_id = item.player_id ? Number(item.player_id) : 0;
    this.wicket_desc = item.wicket_desc || '';
    this.competition_id = item.competition_id ? Number(item.competition_id) : 0;
    this.batting_team = item.batting_team || '';
    this.match_id = item.match_id ? Number(item.match_id) : 0;
    this.wicket_no = item.wicket_no ? Number(item.wicket_no) : 0;
    this.innings_no = item.innings_no ? Number(item.innings_no) : 0;
    this.player_name = item.player_name || '';
    this.client_id = item.client_id ? Number(item.client_id) : 0;
    this.over_value = item.over_value ? Number(item.over_value) : 0;
  }
}

//Season Model
export class SeasonModel {
  current: number;
  season_value: string;
  season_id: number;

  constructor(item: Partial<SeasonModel> = {}) {
    this.current = item.current ? Number(item.current) : 0;
    this.season_value = item.season_value || '';
    this.season_id = item.season_id ? Number(item.season_id) : 0;
  }
}

