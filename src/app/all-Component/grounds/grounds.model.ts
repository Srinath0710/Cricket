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
    northern_end: string;
    sourthern_end: string;
    north: string;
    south: string;
    east: string;
    west: string;
    club_id: string;
    latitude: string;
    longitude: string;
    capacity: string|number;
    reference_id: string;
  ground_photo: string;


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
        this.northern_end = item.northern_end || '';
        this.sourthern_end = item.sourthern_end || '';
        this.north = item.north || '';
        this.south = item.south || '';
        this.east = item.east || '';
        this.west = item.west || '';
        this.club_id = item.club_id || '';
        this.latitude = item.latitude || '';
        this.longitude = item.longitude || '';
        this.capacity = item.capacity || 0;
        this.reference_id = item.reference_id || '';
        this.ground_photo = item.ground_photo || '';
    }
}

export class UpdateGround {
    user_id: string|number;
    client_id: string|number;
    ground_id: string|number|null;
    ground_name: string;
    display_name: string;
    country_id: string|number;
    state_id: string|number;
    city_id: string|number;
    address_1: string;
    address_2: string;
    post_code: string|number;
    northern_end: string;
    sourthern_end: string;
    north: string;
    south: string;
    east: string;
    west: string;
    club_id: string|number |null;
    latitude: string;
    longitude: string;
    capacity: number;
    reference_id: string;
    profile: string;
    ground_photo: string;
   
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
        this.northern_end = item.northern_end || '';
        this.sourthern_end = item.sourthern_end || '';
        this.north = item.north || '';
        this.south = item.south || '';
        this.east = item.east || '';
        this.west = item.west || '';
        this.club_id = item.club_id || 0;
        this.latitude = item.latitude || '';
        this.longitude = item.longitude || '';
        this.capacity = item.capacity || 0;
        this.reference_id = item.reference_id || '';
        this.profile = item.profile || '';
        this.ground_photo = item.ground_photo || '';
        this.action_flag = item.action_flag || '';

    }
}