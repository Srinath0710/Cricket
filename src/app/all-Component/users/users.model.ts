export class Users {
  user_id: number;
  user_name: string;
  email: string;
  user_type: string;
  record_status: string;

  constructor(item: Partial<Users> = {}) {
    this.user_id = item.user_id || 0;
    this.user_name = item.user_name || '';
    this.email = item.email || '';
    this.user_type = item.user_type || '';
    this.record_status = item.record_status || '';
  }
}

export class UserList {
  user_id: number;
  client_id: number;

  constructor(item: Partial<UserList> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
  }
}

// export class EditUser {
//   user_id: number;
//   client_id: number;
//   user_name: string;
//   email: string;
//   role_id: number;
//   ref_id: string | number;
//   user_type: string | number;

//   constructor(item: Partial<EditUser> = {}) {
//     this.user_id = item.user_id || 0;
//     this.client_id = item.client_id || 0;
//     this.user_name = item.user_name || '';
//     this.email = item.email || '';
//     this.role_id = item.role_id || 0;
//     this.ref_id = item.role_id || 0;
//     this.user_type = item.user_type || 0;
//   }
// }

export class CreateUser {
  user_id?: string | number;
  client_id: string | number;
  user_name: string;
  u_password: string;
  email: string;
  user_type: string;
  role_id: number;
  ref_id: String;
  login_user_id?: string | number;

  constructor(item: Partial<CreateUser> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.user_name = item.user_name || '';
    this.u_password = item.u_password || '';
    this.email = item.email || '';
    this.user_type = item.user_type || '';
    this.role_id = item.role_id || 0;
    this.ref_id = item.ref_id || '';
    this.login_user_id = item.login_user_id || '';

  }
}

export class UpdateUser {
  user_id?: string | number;
  client_id: string | number;
  user_name: string;
  email: string;
  role_id: string;
  ref_id: string | number;
  login_user_id?: string | number;
  action_flag: string;
  u_password?: any;

  constructor(item: Partial<UpdateUser> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.user_name = item.user_name || '';
    this.email = item.email || '';
    this.role_id = item.role_id || '';
    this.ref_id = item.ref_id || '';
    this.login_user_id = item.login_user_id || '';
    this.action_flag = item.action_flag || '';
    this.u_password = item.u_password || '';
  }
}

export class getUserListCreation {
  user_id: number;
  client_id: number;
  user_type: string | number;

  constructor(item: Partial<getUserListCreation> = {}) {
    this.user_id = item.user_id || 0;
    this.client_id = item.client_id || 0;
    this.user_type = item.user_type || 0;
  }
}
