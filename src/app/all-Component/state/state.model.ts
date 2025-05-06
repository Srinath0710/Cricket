export class State {
    state_id: number;
    state_code: string;
    state_name: string;
    country_id: number;
    record_status: string;
  static state_id: any;
  static state_name: any;

    constructor(item: Partial<State> = {}) {
        this.state_id = item.state_id || 0;
        this.state_code = item.state_code || '';
        this.state_name = item.state_name || '';
        this.country_id = item.country_id || 0;
        this.record_status = item.record_status || '';
    }
}

export class StateList {
    user_id: string | number;
    client_id: string | number;
    country_id: string | number;

    constructor(item: Partial<StateList> = {}) {
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.country_id = item.country_id || 0;
    }
    
}

export class EditState {
    state_id!: number;
    state_code!: string;
    state_name!: string;
    country_id!: number;

    constructor(item: Partial<EditState> = {}) {
        this.state_id = item.state_id || 0;
        this.state_code = item.state_code || '';
        this.state_name = item.state_name || '';
        this.country_id = item.country_id || 0;
    }
}

export class UpdateState {
    user_id: string | number;
    client_id: string | number;
    country_id: string | number;
    state_name: string | number;
    state_code: string | number;
    state_id: string | number;

    constructor(item: Partial<UpdateState> = {}) {
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.country_id =  item.country_id || 0;
        this.state_code = item.state_code || '';
        this.state_name = item.state_name || '';
        this.state_id = item.state_id || 0;
    }
}