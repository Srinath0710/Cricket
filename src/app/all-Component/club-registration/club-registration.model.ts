import { Nullable } from "primeng/ts-helpers";

export class Club {
    club_id : number;
    club_name : string;
    parent_club_name : string;
    country_name : string;
    state_name : string;
    city_name : string;
    address_1 : string;
    address_2 : string;
    post_code : string;
    email_id : string;
    mobile : number;
    website : string;
    profile_img : string;
    record_status : string;
  gridData: any;

    constructor(item: Partial<Club> = {}){
        this.club_id = item.club_id || 0;
        this.club_name = item.club_name || '';
        this.parent_club_name = item.parent_club_name || '';
        this.country_name = item.country_name || '';
        this.state_name = item.state_name || '';
        this.city_name = item.city_name || '';
        this.address_1 = item.address_1 || '';
        this.address_2 = item.address_2 || '';
        this.post_code = item.post_code || '';
        this.email_id = item.email_id || '';
        this.mobile = item.mobile || 0;
        this.website = item.website || '';
        this.profile_img = item.profile_img || '';
        this.record_status = item.record_status || '';
    }
}

    export class ClubList {
        user_id : string|number;
        client_id : string|number;
        club_id : string|number;

    constructor(item: Partial<ClubList> = {}){
        this.user_id = item.user_id || 0;
        this.client_id = item.client_id || 0;
        this.club_id = item.club_id || 0;    
    }    
}

export class EditClub {
        club_id : number;
        club_short : string;
        club_name : string;
        parent_club_id : number;
        country_id : string;
        state_id : string;
        city_id : string;
        address_1 : string;
        address_2: string;
        post_code : string;
        email_id : string;
        mobile: number;
        website : string;
        contact : number;
        remarks : string;
        profile_img : string;


    constructor(item: Partial<EditClub> = {}){
        this.club_id = item.club_id || 0;
        this.club_short = item.club_short || '';
        this.club_name = item.club_name || '';
        this.parent_club_id = item.parent_club_id || 0;
        this.country_id = item.country_id || '';
        this.state_id = item.state_id || '';
        this.city_id = item.city_id || '';
        this.address_1 = item.address_1 || '';
        this.address_2 = item.address_2 || '';
        this.post_code = item.post_code || '';
        this.email_id = item.email_id || '';
        this.mobile = item.mobile || 0;
        this.website = item.website || '';
        this.contact = item.contact || 0;
        this.remarks = item.remarks || '';
        this.profile_img = item.profile_img || '';
    }    
}

export class UpdateClub {
    user_id : string;
    club_id : string;
    client_id : string;
    club_short : string;
    club_name : string;
    parent_club_id : string|Nullable;
    address_1 : string;
    address_2 : string;
    country_id : string;
    state_id : string;
    city_id : string;
    action_flag?: string;
    post_code : string | number;
    email_id : string;
    mobile : string | number;
    website : string;
    contact : string | number;
    remarks: string;
    profile_img : string;

constructor(item: Partial<UpdateClub> = {}){
    this.user_id = item.user_id || '';
    this.club_id = item.club_id || '';
    this.client_id = item.client_id || '';
    this.club_short = item.club_short || '';
    this.club_name = item.club_name || '';
    this.parent_club_id = item.parent_club_id || '';
    this.address_1 = item.address_1 || '';
    this.address_2 = item.address_2 || '';
    this.country_id = item.country_id || '';
    this.state_id = item.state_id || '';
    this.city_id = item.city_id || '';
    this.action_flag = item.action_flag || '';
    this.post_code = item.post_code || 0;
    this.email_id = item.email_id || '';
    this.mobile = item.mobile || 0;
    this.website = item.website || '';
    this.contact = item.contact || 0;
    this.remarks = item.remarks || '';
    this.profile_img = item.profile_img || '';
}
}
