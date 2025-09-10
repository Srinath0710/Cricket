
export class FilterMatchModel {
    series: string;
    startDate: string;
    endDate: string;
    matchType: string;
    gender: string;
    ageGroup: string;
    status: string;
    teamFormat: string;
    competition_id: number;
    match_id: string;
    match: string;
    constructor(item: Partial<FilterMatchModel> = {}) {
        this.series = item.series || '';
        this.startDate = item.startDate || '';
        this.endDate = item.endDate || '';
        this.matchType = item.matchType || '';
        this.gender = item.gender || '';
        this.ageGroup = item.ageGroup || '';
        this.status = item.status || '';
        this.teamFormat = item.teamFormat || '';
        this.competition_id = item.competition_id || 0;
        this.match_id = item.match_id || '';
        this.match = item.match || '';
    }
}

export class CompetitionModel {
    series: string;
    dateTime: string;
    stadium: string;
    location: string;
    matchType: string;
    teamA: any;
    teamB: any;
    competition_id: number;
    resultStatus: string;
    type: string; // live/upcoming/result
    competitionName: any;
    startDate: any;
    venue: any;
    teamASummary: any;
    teamBSummary: any;
    result: any;

    constructor(item: Partial<CompetitionModel> = {}) {
        this.series = item.series || '';
        this.dateTime = item.dateTime || '';
        this.stadium = item.stadium || '';
        this.location = item.location || '';
        this.matchType = item.matchType || '';
        this.competition_id = item.competition_id || 0;
        this.teamA = item.teamA || null;
        this.teamB = item.teamB || null;
        this.resultStatus = item.resultStatus || '';
        this.type = item.type || '';
    }
}

export class MatchSummaryModel {
    matchId: string;
    competitionName: string;
    teamA: string;
    teamB: string;
    teamASummary: string;
    teamBSummary: string;
    venue: string;
    startDate: string;
    endDate: string;
    result: string;
    matchType: string;
    status: string;
    competition_id: number;
    constructor(item: Partial<MatchSummaryModel> = {}) {
        this.matchId = item.matchId || '';
        this.competitionName = item.competitionName || '';
        this.teamA = item.teamA || '';
        this.teamB = item.teamB || '';
        this.teamASummary = item.teamASummary || '';
        this.teamBSummary = item.teamBSummary || '';
        this.venue = item.venue || '';
        this.startDate = item.startDate || '';
        this.endDate = item.endDate || '';
        this.result = item.result || '';
        this.matchType = item.matchType || '';
        this.status = item.status || '';
        this.competition_id = item.competition_id || 0;
    }
}

export class ScheduleModel {
    matchId: string;
    competitionName: string;
    teamA: string;
    teamB: string;
    teamASummary: string;
    teamBSummary: string;
    venue: string;
    startDate: string;
    endDate: string;
    result: string;
    matchType: string;
    status: string;
    teamFormat: string;
    gender: string;
    ageCategory: string;

    constructor(item: Partial<ScheduleModel> = {}) {
        this.matchId = item.matchId || '';
        this.competitionName = item.competitionName || '';
        this.teamA = item.teamA || '';
        this.teamB = item.teamB || '';
        this.teamASummary = item.teamASummary || '';
        this.teamBSummary = item.teamBSummary || '';
        this.venue = item.venue || '';
        this.startDate = item.startDate || '';
        this.endDate = item.endDate || '';
        this.result = item.result || '';
        this.matchType = item.matchType || '';
        this.status = item.status || '';
        this.teamFormat = item.teamFormat || '';
        this.gender = item.gender || '';
        this.ageCategory = item.ageCategory || '';
    }
}

export class BattingSummaryModel {
    matchId: string;
    inningsNo: string;
    battingTeam: string;
    playerId: string;
    playerName: string;
    battingOrder: number;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    wicketDesc: string | null;

    constructor(item: Partial<BattingSummaryModel> = {}) {
        this.matchId = item.matchId || '';
        this.inningsNo = item.inningsNo || '';
        this.battingTeam = item.battingTeam || '';
        this.playerId = item.playerId || '';
        this.playerName = item.playerName || '';
        this.battingOrder = item.battingOrder || 0;
        this.runs = item.runs || 0;
        this.balls = item.balls || 0;
        this.fours = item.fours || 0;
        this.sixes = item.sixes || 0;
        this.strikeRate = item.strikeRate || 0;
        this.wicketDesc = item.wicketDesc || null;
    }
}

export class BowlingSummaryModel {
    matchId: string;
    inningsNo: string;
    bowlingTeam: string;
    playerId: string;
    playerName: string;
    bowlingOrder: number;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    foursConceded: number;
    sixesConceded: number;
    dotBalls: number;
    strikeRate?: number;

    constructor(item: Partial<BowlingSummaryModel> = {}) {
        this.matchId = item.matchId || '';
        this.inningsNo = item.inningsNo || '';
        this.bowlingTeam = item.bowlingTeam || '';
        this.playerId = item.playerId || '';
        this.playerName = item.playerName || '';
        this.bowlingOrder = item.bowlingOrder || 0;
        this.overs = item.overs || 0;
        this.maidens = item.maidens || 0;
        this.runs = item.runs || 0;
        this.wickets = item.wickets || 0;
        this.economy = item.economy || 0;
        this.foursConceded = item.foursConceded || 0;
        this.sixesConceded = item.sixesConceded || 0;
        this.dotBalls = item.dotBalls || 0;
        this.strikeRate = item.strikeRate || undefined;
    }
}

export class FallOfWicketModel {
    matchId: string;
    inningsNo: string;
    battingTeam: string;
    wicketNo: number;
    teamTotal: number;
    overValue: number;
    playerId: string;
    playerName: string;
    wicketDesc: string;

    constructor(item: Partial<FallOfWicketModel> = {}) {
        this.matchId = item.matchId || '';
        this.inningsNo = item.inningsNo || '';
        this.battingTeam = item.battingTeam || '';
        this.wicketNo = item.wicketNo || 0;
        this.teamTotal = item.teamTotal || 0;
        this.overValue = item.overValue || 0;
        this.playerId = item.playerId || '';
        this.playerName = item.playerName || '';
        this.wicketDesc = item.wicketDesc || '';
    }
}

export class SeasonModel {
    current: string;
    season_value: string;
    season_id: string;

    constructor(item: Partial<SeasonModel> = {}) {
        this.current = item.current || '';
        this.season_value = item.season_value || '';
        this.season_id = item.season_id || '';
    }
}
