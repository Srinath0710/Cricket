export class Season{
    season_id:number | undefined;
    season_name:string | undefined;
    start_date:string | undefined;
    end_date:string | undefined;
    season_status:string | undefined;
    record_status:string | undefined;

    constructor(item: Partial<Season> = {}){
        this.season_id = item.season_id || 0 ;
        this.season_name = item.season_name || '';
        this.start_date = item.start_date || '';
        this.end_date = item.end_date || '';
        this.season_status = item.season_status || '';
        this.record_status = item.record_status || '';
    }
}

export class getSeasons{
    user_id: string | number;
    client_id: string | number;
    season_id: string | number;

    constructor(item: Partial<getSeasons> = {}){
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.season_id = item.season_id || 0;
    }
}

export class UpdateSeason {
    user_id: string|number;
    client_id: string|number;
    season_id: string|number;
    season_name: string;
    start_date: string|number;
    end_date: string|number;
    season_status: string;

    constructor(item: Partial<UpdateSeason> = {}){
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.season_id = item.season_id || 0;
        this.season_name = item.season_name || '';
        this.start_date = item.start_date || '';
        this.end_date = item.end_date || '';
        this.season_status = item.season_status || '';
    }
}

export class EditSeason {
    season_id: string|number;
    season_name: string|number;
    start_date: string|number;
    client_id: string|number;
    end_date: string|number;
    season_status: string|number;

    constructor(item: Partial<EditSeason> = {}){
        this.season_id = item.season_id || 0;
        this.season_name = item.season_name || '';
        this.start_date = item.start_date || '';
        this.client_id = item.client_id || '';
        this.end_date = item.end_date || '';
        this.season_status = item.season_status || '';
    }
}
