import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CricketKeyConstant } from '../services/cricket-key-constant';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule ,
    HttpClientJsonpModule 
  ]
})
export class LoginComponent {
  public loginForm: FormGroup<any>;
  statusConstants= CricketKeyConstant.status_code;
  errors = [];
  password = true;
  submitted = false;
  errorMessage = '';
  envImagePath = environment.imagePath;
  mfaRegister = 0;
  mfaEnable = 0;
  isMFAvisible=false
  qrCodeVisible=false
  qrImage:any;
//   loginImage = 'assets/login_image.jpg';
  constructor(private formBuilder: FormBuilder, private Route: Router, private _authService: AuthService, private apiService: ApiService,  @Inject(PLATFORM_ID) private platformId: Object ) {
      this.loginForm = this.formBuilder.group({
          user_name: ["", [Validators.required]],
          password: ["", [Validators.required]],
          mfa_code: ["", []],

      });
  } 

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    
  }
  clearError() {
      this.errorMessage = ''
  }

  loginUser() {
      this.submitted = true;
      if (this.loginForm.invalid) {
          this.loginForm.markAllAsTouched();
          return
      }
      var ip_address='',detail_info={}
      this._authService.getIpCliente().subscribe((data: any) => {
        ip_address=data.ip !=undefined ?data.ip:null;
        detail_info=data !=undefined?data:{};
      var params: any = {};
      params.user_name = this.loginForm.value.user_name;
      params.password = this.loginForm.value.password;
      params.totp=this.loginForm.value.mfa_code;
      params.ip_address=ip_address;
      const url = 'Login/user_login'
      this._authService.loginUser(params, url)
          .subscribe((res: any) => {
              if ( res.status_code === this.statusConstants.success) {
                  var userData = res.data[0];
                  if (isPlatformBrowser(this.platformId)) {
                  localStorage.setItem('user_name', userData.user_name)
                  localStorage.setItem('role_id', userData.role_id)
                  localStorage.setItem('user_mail', userData.email)
                  localStorage.setItem('header_color', userData.header_color)
                  localStorage.setItem('user_type', userData.user_type)
                  localStorage.setItem('client_id', userData.client_id)
                  localStorage.setItem('ref_id', userData.ref_id)
                  localStorage.setItem('association_id', userData.association_id)
                  localStorage.setItem('profile_img_url', userData.profile_img_url != null && userData.profile_img_url != '' && userData.profile_img_url != 'null' ? userData.profile_img_url : this.envImagePath + '/login_image.jpg')
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('refresh_token', res.refresh_token);
                  localStorage.setItem('idle_timeout', userData.idle_timeout);
                  localStorage.setItem('idle_timeout_enable', userData.idle_timeout_enable);
                  localStorage.setItem('user_id', res.data[0].user_id != undefined ? res.data[0].user_id : null);
                  }
                  var clientDetails = {
                      ipaddress: ip_address,
                      userAgent: navigator.userAgent,
                      appName: navigator.appName,
                      appVersion: navigator.appVersion,
                      platform: navigator.platform,
                      language: navigator.language,
                      online: navigator.onLine ? 'Online' : 'Offline',
                      detail_info:detail_info
                  }
                  let params: any = {

                      "token": localStorage.getItem('token'),
                      "ip_address": clientDetails,
                      "action_flag": "update_ip_address",
                      "user_id": localStorage.getItem('user_id'),

                  }
                this.Route.navigate(['']);
              } else if(res.status_code == 406 && res.status_code == 400 ) {
                  this.errorMessage = res.error.message;

              }else if(res.status_code == 401){
                  this.isMFAvisible = false
                  this.qrCodeVisible =false
                  this.loginForm.patchValue({
                      mfa_code:null
                  });
                  localStorage.clear();
                  this.qrImage=null;


              }
          }, (err: any) => {
             var error=err.error

             if(error.status_code == 406 || error.status_code == 400 ) {
                  this.errorMessage = error.message;
                 
              }else if(error.status_code == 401){
                  this.isMFAvisible = false
                  this.qrCodeVisible =false
                  this.loginForm.patchValue({
                      mfa_code:null
                  });
                  localStorage.clear();
                  this.qrImage=null;
                  this.errorMessage = error.message;

              }

          });
      });

  }
  generateQr() {
    var params: any = {};
    params.user_name = this.loginForm?.get('user_name')?.value;
    params.user_id = localStorage.getItem('user_id');
    const url = 'Login/GenerateQR'
    this._authService.loginUser(params, url)
        .subscribe((res: any) => {
                this.qrImage =res.QrCodeBase64!=null?'data:image/png;base64,' +  res.QrCodeBase64:null;
           console.log( this.qrImage)
        }, (err: any) => {
            this.errorMessage = err.message;

        });
}
  userIdentity() {
      this.submitted = true;
      if (this.loginForm.invalid) {
          this.loginForm.markAllAsTouched();
          return
      }
      var params: any = {};
      params.user_name = this.loginForm.value.user_name;
      // params.password = this.loginForm.get('password').value;
      const url = 'Login/get_user_identity'
      this._authService.loginUser(params, url)
          .subscribe((res: any) => {
              if (res.status_code === this.statusConstants.success && res.status ) {
                  var response = res.data[0] != undefined ? res.data[0] : null

                  localStorage.setItem('user_name', response.user_name != undefined ? response.user_name : null);
                  localStorage.setItem('user_id', response.user_id != undefined ? response.user_id : null);

                  this.isMFAvisible = response.mfa_enable!=null && response.mfa_enable!=undefined && response.mfa_enable==1?true:false
                  this.qrCodeVisible =response.mfa_register!=null && response.mfa_register!=undefined && response.mfa_register==1?true:false
                  setTimeout(()=>{
                      if( this.isMFAvisible==true && this.qrCodeVisible==false){
                          this.submitted=false;
                          this.generateQr();
                      }
                      if( this.isMFAvisible==false && this.qrCodeVisible==false){
                          this.loginUser();
                      }
                  },200)
              }
              
          }, (err: any) => {
              this.errorMessage = err.error.message;

          });
  }

  passwordVisible() {
      this.password = !this.password
      setTimeout(() => {
          this.password = !this.password;
      }, 600)

  }
  refreshPage(){
      this.isMFAvisible = false
      this.qrCodeVisible =false
      this.loginForm.reset();
      this.qrImage=null;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.clear();
      }
  }
}
