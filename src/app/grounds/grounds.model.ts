export class Grounds {
    ground_id: number;
    ground_name: string;
    country_name: string;
    state_name: string;
    city_name: string;
    record_status: string;

    constructor(item: Partial<Grounds> = {}){
        this.ground_id = item.ground_id || 0;
        this.ground_name = item.ground_name || '';
        this.country_name = item.country_name || '';
        this.state_name = item.state_name || '';
        this.city_name = item.city_name || '';
        this.record_status = item.record_status || '';
    }
}

export class GroundList {
    user_id: string|number;
    client_id: string|number;
    ground_id: string|number;

    constructor(item: Partial<GroundList> = {}) {
        this.user_id = item.user_id || '';
        this.client_id = item.client_id || '';
        this.ground_id = item.ground_id || '';
    }
}

export class EditGround {
    ground_id: number;
    ground_name: string;
    display_name: string;
    country_id: number;
    state_id: number;
    city_id: number;
    address_1: string;
    address_2: string;
    post_code: string;
    end_one: string;
    end_two: string;

    constructor(item: Partial<EditGround> = {}) {
        this.ground_id = item.ground_id || 0;
        this.ground_name = item.ground_name || '';
        this.display_name = item.display_name || '';
        this.country_id = item.country_id || 0;
        this.state_id = item.state_id || 0;
        this.city_id = item.city_id || 0;
        this.address_1 = item.address_1 || '';
        this.address_2 = item.address_2 || '';
        this.post_code = item.post_code || '';
        this.end_one = item.end_one || '';
        this.end_two = item.end_two || '';
    }
}

export class UpdateGround {
    user_id: string|number;
    client_id: string|number;
    ground_id: string|number;
    ground_name: string;
    display_name: string;
    country_id: string|number;
    state_id: string|number;
    city_id: string|number;
    address_1: string;
    address_2: string;
    post_code: string|number;
    end_one: string;
    end_two: string;
    action_flag: string;


    constructor(item: Partial<UpdateGround> = {}) {
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.ground_id = item.ground_id || 0;
        this.ground_name = item.ground_name || '';
        this.display_name = item.display_name || '';
        this.country_id = item.country_id || 0;
        this.state_id = item.state_id || 0;
        this.city_id = item.city_id || 0;
        this.address_1 = item.address_1 || '';
        this.address_2 = item.address_2 || '';
        this.post_code = item.post_code || 0;
        this.end_one = item.end_one || '';
        this.end_two = item.end_two || '';
        this.action_flag = item.action_flag || '';

    }
}