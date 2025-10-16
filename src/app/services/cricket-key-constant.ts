export class CricketKeyConstant {
    static status_code = {
        success: '200',
        refresh: '401',
        status_code:'400',
        refresh_msg: 'Expired',
        status_code_key: 'status_code'
    }
    static condition_key = {
        active_status: { key: 'active', label: 'Activate', status: 'Active' },
        deactive_status: { key: 'deactive', label: 'Deactivate', status: 'InActive' }
    }
    static dropdown_keys = {
        config_key: {

            team_format: 'team_format',
            officials: 'officials',
            gender: 'gender',
            age_category: 'age_category',
        },
        official_keys: {
            analyst: { short_key: 'VDA', label: 'Analyst Level', key: 'analyst' },
            scorer: { short_key: 'SCR', label: 'Scorer Type', key: 'scorer' },
            umpire_category: { short_key: 'UMP', label: 'Umpire Category', key: 'umpire_category' }
        }

    }
    static default_image_url = {
        officials: 'assets/images/umpires.jpg',
        players: 'assets/images/player.jpg',
        grounds: 'assets/images/ground4.png',
        clientimg: 'assets/images/clients.webp',
        teamimage: 'assets/images/team.jpg',
        clubs: 'assets/images/clubs.png',
        countryimg: 'assets/images/country.webp',
        menimg: 'assets/images/men-default.png',
        womenimg: 'assets/images/women-default.png'
    }
    static action_flag={
        Create:'create',
        Update:'update',
        Country:'get_countries',
        City:'get_city_by_state',
        State:'get_state_by_country',
        Uploadprofile:'update_profile_url',
        Gridload:'grid_load',
        Dropdown:'dropdown',

    }
}