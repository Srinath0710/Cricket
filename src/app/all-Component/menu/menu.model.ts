export class Menu {
  user_id: string | number;

  constructor(item: Partial<Menu> = {}) {
    this.user_id = item.user_id || 0;
  }
}
export class getMenudropdown {
  user_id: string | number;
  menu_id: string | number;
  menu_name: string;
  parent_menu_id: string | number;
  module_id: string | number;
  module_name: string;

  constructor(item: Partial<getMenudropdown> = {}) {
    this.user_id = item.user_id || 0;
    this.menu_id = item.menu_id || 0;
    this.menu_name = item.menu_name || '';
    this.parent_menu_id = item.parent_menu_id || 0;
    this.module_id = item.module_id || 0;
    this.module_name = item.module_name || '';


  }

}
export class addMenu {
  user_id: string | number;
  menu_title: string;
  menu_name: string;
  menu_description: string;
  menu_link: string;
  menu_image: string;
  module_id: string | number;
  parent_menu_id: string | number;
  sort_order: string | number;
  menu_id: string | number;



  constructor(item: Partial<addMenu> = {}) {
    this.user_id = item.user_id || 0;
    this.menu_title = item.menu_title || '';
    this.menu_id = item.menu_id || 0;
    this.menu_name = item.menu_name || '';
    this.menu_description = item.menu_description || '';
    this.menu_image = item.menu_image || '';
    this.menu_link = item.menu_link || '';
    this.module_id = item.module_id || 0;
    this.parent_menu_id = item.parent_menu_id || '';
    this.sort_order = item.sort_order || '';
  }
}
export class editMenu {
  user_id: string | number;
  menu_id: string | number;
  menu_title: string;
  menu_name: string;
  menu_description: string;
  menu_link: string;
  menu_image: string;
  module_id: string | number;
  parent_menu_id: string | number;
  sort_order: string | number

  constructor(item: Partial<editMenu> = {}) {
    this.user_id = item.user_id || 0;
    this.menu_id = item.menu_id || 0;
    this.menu_title = item.menu_title || '';
    this.menu_name = item.menu_name || '';
    this.menu_description = item.menu_description || '';
    this.menu_image = item.menu_image || '';
    this.menu_link = item.menu_link || '';
    this.module_id = item.module_id || 0;
    this.parent_menu_id = item.parent_menu_id || '';
    this.sort_order = item.sort_order || '';

  }
}
export class endpointMenulist {
  api_id: string | number;
  user_id: string | number;
  api_group: string;
  api_endpoint_url: string;
  api_desc: string;
  api_method_type: string;
  menu_id: string | number;
  menu_name: string;
  record_status: string;


  constructor(item: Partial<endpointMenulist> = {}) {
    this.api_id = item.api_id || 0;
    this.user_id = item.user_id || 0;
    this.api_group = item.api_group || '';
    this.api_endpoint_url = item.api_endpoint_url || '';
    this.api_desc = item.api_desc || '';
    this.api_method_type = item.api_method_type || '';
    this.menu_id = item.menu_id || 0;
    this.menu_name = item.menu_name || '';
    this.record_status = item.record_status || '';

  }

}
export class addendpoint {
  user_id: string | number;
  api_group: string;
  api_endpoint_url: string;
  api_desc: string;
  api_method_type: string;
  menu_id: string | number;

  constructor(item: Partial<addendpoint> = {}) {
    this.user_id = item.user_id || 0;
    this.api_group = item.api_group || '';
    this.api_endpoint_url = item.api_endpoint_url || '';
    this.api_desc = item.api_desc || '';
    this.api_method_type = item.api_method_type || '';
    this.menu_id = item.menu_id || 0;

  }
}

