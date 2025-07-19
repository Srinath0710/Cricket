import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
// import { Menu, UpdateState, EditState } from './state.model';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { Drawer } from 'primeng/drawer';
import { Menu, addMenu, getMenudropdown, editMenu, endpointMenulist } from './menu.model';
import { UploadImgService } from '../../Profile_Img_service/upload-img.service';
import { SpinnerService } from '../../services/Spinner/spinner.service';





@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, BadgeModule, DialogModule, FormsModule, InputTextModule, ReactiveFormsModule, PaginatorModule, TagModule, ConfirmDialogModule, DropdownModule, TooltipModule, Drawer
    , ToastModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: MessageService },
    { provide: CricketKeyConstant },
    { provide: ConfirmationService }
  ],
})
export class MenuComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  User_id: number = Number(localStorage.getItem('user_id'));
  Client_id: number = Number(localStorage.getItem('client_id'));
  public menuData: any[] = [];
  public menusList: any[] = [];
  uploadedImage: string | ArrayBuffer | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  imageBase64: any = null;
  filedata: any;
  profileImages: any;
  imageCropAlter: any;
  imageDefault: any;
  url: any;
  src: any;
  profile_img: any

  currentMenu: any;

  public ShowForm: boolean = false;
  public showEndpointForm: boolean = false;
  //public showEndpointsDialog: boolean = false;
  public showEndpointsGrid: boolean = false;
  public addMenuForm!: FormGroup<any>;
  public addEndpointForm!: FormGroup<any>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  MenuData: Menu[] = [];
  totalData: any = 0;
  first: number = 1;
  submitted: boolean = true;
  searchKeyword: string = '';
  isEditMode: boolean = false;
  isEditEndpoint: boolean = false;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  menuID: any;
  selectedApiEndpoints: any[] = [];
  selectedMenuName: string = '';
  endpointMenus: any[] = [];




  conditionConstants = CricketKeyConstant.condition_key;
  statusConstants = CricketKeyConstant.status_code;
  menusData: any;




  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private confirmationService: ConfirmationService,
    public cricketKeyConstant: CricketKeyConstant,
    private uploadImgService: UploadImgService,
    public spinnerService: SpinnerService,
  ) { }

  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.gridLoad();
    this.parentmenuDropdown();
    this.endpointDropdown();
    this.addMenuForm = this.formBuilder.group({
      parent_menu_id: ['', Validators.required],
      menu_title: ['', Validators.required],
      menu_name: ['', Validators.required],
      menu_link: [''],
      menu_image: [''],
      sort_order: ['', Validators.required],
      module_id: ['', Validators.required],

      menu_description: [''],
      menu_id: [''],
    });
    this.addEndpointForm = this.formBuilder.group({
      api_group: ['', Validators.required],
      api_endpoint_url: ['', Validators.required],
      api_method_type: ['', Validators.required],
      api_desc: [''],
      menu_id: ['', Validators.required],
      api_id: ['']
    });


  }
  parentmenuDropdown() {
    const params: any = {
      user_id: this.User_id?.toString(),
    };
    this.apiService.post(this.urlConstant.getMenudropdown, params).subscribe((res) => {
      this.menusData = res.data.menus ?? [];
      this.menusList = res.data.modules ?? [];

      this.gridLoad();

    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
    });
  }

  menuDropdown() {
    const params: any = {
      user_id: this.User_id?.toString(),
    };
    this.apiService.post(this.urlConstant.menunameDropdown, params).subscribe((res) => {
      this.menusData = res.data.menus ?? [];
      // this.menusList = res.data.modules ?? [];

      this.gridLoad();

    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
    });
  }

  endpointDropdown() {
    const params: any = {
      user_id: this.User_id?.toString(),
    };
    this.apiService.post(this.urlConstant.endpointdropdown, params).subscribe((res) => {
      this.endpointMenus = res.data.menus ?? [];
      // this.menusList = res.data.modules ?? [];

      this.gridLoad();

    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
    });
  }

  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {}
    params.user_id = this.User_id?.toString()
    this.apiService.post(this.urlConstant.getMenuList, params).subscribe((res) => {
      this.MenuData = res.data.menus ?? [];
      this.totalData = this.MenuData.length != 0 ? res.data.menus[0].total_records : 0
      this.spinnerService.raiseDataEmitterEvent('off');
          this.MenuData.forEach((val: any) => {
          val.menu_image = `${val.menu_image}?${Math.random()}`;
        });
    }, (err: any) => {
      err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken()
        : (this.spinnerService.raiseDataEmitterEvent('off'),this.MenuData = [], this.totalData = this.MenuData.length);

    });

  }
  onPageChange(event: any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
    this.gridLoad();
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  status(menu_id: number, url: string) {
    const params: any = {
      user_id: this.User_id?.toString(),
      menu_id: menu_id?.toString(),
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading state list:', err);
        }
      });
  }
  statusconvert(api_id: number, url: string) {
    const params: any = {
      user_id: this.User_id?.toString(),
      api_id: api_id?.toString(),
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
       res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.viewEndpoints(this.currentMenu)) : this.failedToast(res);
      },
      (err: any) => {
        error: (err: any) => {
          console.error('Error loading state list:', err);
        }
      });
  }
  StatusConfirm(menu_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    console.log('StatusConfirm called', { menu_id, actionObject, currentStatus });
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

    if (AlreadyStatestatus) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this menu name?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key
          ? this.urlConstant.activateMenu
          : this.urlConstant.deactivateMenu;
        this.status(menu_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  StatusConfirmendpoint(api_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    console.log('StatusConfirmendpoint called', { api_id, actionObject, currentStatus });
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

    if (AlreadyStatestatus) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this  api?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key
          ? this.urlConstant.activateEndpoint
          : this.urlConstant.deactivateEndpoint;
        this.statusconvert(api_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  addCallBack(res: any) {
    this.menuID = this.addMenuForm.value.menu_id;
    this.resetForm();
    this.cancelForm();
    this.ShowForm = false;

    this.successToast(res);
    this.showEndpointForm = false;
    this.gridLoad();

  }
  onCreateClick() {
    this.isEditMode = false;
    this.resetForm();
    this.showAddForm();
  }

  addMenu() {
    this.submitted = true;
    console.log(this.isEditMode)
    if (this.addMenuForm.invalid) {
      this.addMenuForm.markAllAsTouched();
      return
    }

    const params: any = {
      user_id: this.User_id?.toString(),
      menu_title: this.addMenuForm.value.menu_title,
      menu_name: this.addMenuForm.value.menu_name,
      menu_description: this.addMenuForm.value.menu_description,
      menu_link: this.addMenuForm.value.menu_link,
      module_id: String(this.addMenuForm.value.module_id),
      menu_image: String(this.addMenuForm.value.menu_image),
      parent_menu_id: String(this.addMenuForm.value.parent_menu_id),
      sort_order: String(this.addMenuForm.value.sort_order),
      menu_id: String(this.addMenuForm.value.menu_id),

    }

    if (this.addMenuForm.value.menu_id) {
      this.apiService.post(this.urlConstant.updateMenu, params).subscribe((res) => {
          if (res.status_code === this.statusConstants.success && res.status) {
   if (res.status_code === this.statusConstants.success && res.status) {
          if (res.data !== null && this.filedata != null) {
            this.profileImgAppend(params.menu_id);
          } else {
            this.addCallBack(res)
          }
        } else {
          this.failedToast(res)
        }
      } (err: any) => {
        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg ?
         this.apiService.RefreshToken() : this.failedToast(err.error);
    }});
    } 
    
    else {
      this.apiService.post(this.urlConstant.addMenus, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && 
        err.error.message === this.statusConstants.refresh_msg ? 
        this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }

  }




  editMenu(menu_id: any) {
    this.isEditMode = true;
    this.ShowForm = true;
    const params: any = {}
    params.user_id = this.User_id?.toString();
    params.menu_id = menu_id?.toString();
    this.apiService.post(this.urlConstant.editMenu, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
        const editRecord: editMenu = res.data.menus[0] ?? {};
        if (editRecord != null) {
          console.log("editRecord", editRecord);
          console.log("menu name", menu_id)
          this.addMenuForm.setValue({
            parent_menu_id: Number(editRecord.parent_menu_id),
            menu_id: editRecord.menu_id,
            menu_title: editRecord.menu_title,
            menu_name: editRecord.menu_name,
            menu_description: editRecord.menu_description,
            menu_link: editRecord.menu_link,
            menu_image: editRecord.menu_image,
            module_id: Number(editRecord.module_id),
            sort_order: editRecord.sort_order,

          });
          this.showAddForm();
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });


  }



  addEndpoint() {
    this.submitted = true;
    if (this.addEndpointForm.invalid) {
      this.addEndpointForm.markAllAsTouched();
      return;
    }

    const params: any = {
      user_id: this.User_id?.toString(),
      api_group: this.addEndpointForm.value.api_group,
      api_endpoint_url: this.addEndpointForm.value.api_endpoint_url,
      api_desc: this.addEndpointForm.value.api_desc,
      api_method_type: this.addEndpointForm.value.api_method_type,
      menu_id: String(this.addEndpointForm.value.menu_id),
      api_id: String(this.addEndpointForm.value.api_id),


    };


    if (this.addEndpointForm.value.api_id) {

      this.apiService.post(this.urlConstant.updateendpoint, params).subscribe(
        (res) => {
          res.status_code === this.statusConstants.success && res.status
            ? this.addCallBack(res)
            : this.failedToast(res);
           this.viewEndpoints(this.currentMenu);
        },
        (err: any) => {
          err.status === this.statusConstants.refresh &&
            err.error.message === this.statusConstants.refresh_msg
            ? this.apiService.RefreshToken()
            : this.failedToast(err);
        }
      );
    }
    else {

      this.apiService.post(this.urlConstant.addendpoint, params).subscribe(
        (res) => {
          res.status_code === this.statusConstants.success && res.status
            ? this.addCallBack(res)
            : this.failedToast(res);
             this.viewEndpoints(this.currentMenu);
        },
        (err: any) => {
          err.status === this.statusConstants.refresh &&
            err.error.message === this.statusConstants.refresh_msg
            ? this.apiService.RefreshToken()
            : this.failedToast(err);
        }
      );
    }
  }




  EditEndpoint(editRecord: any) {
    this.showAddEndpointForm();
    console.log("data", editRecord)
    this.isEditEndpoint = true;
    const params: any = {}
    this.addEndpointForm.setValue({
      menu_id: editRecord.menu_id,
      api_id: editRecord.api_id,
      api_group: editRecord.api_group,
      api_endpoint_url: editRecord.api_endpoint_url,
      api_method_type: editRecord.api_method_type,
      api_desc: editRecord.api_desc,


    });


  }

  backToMenuGrid() {
    this.showEndpointsGrid = false;
    this.selectedApiEndpoints = [];
  }




  viewEndpoints(menu: any) {
    this.currentMenu = menu;
    this.selectedMenuName = this.currentMenu.menu_name;
    this.selectedApiEndpoints = [];
    this.showEndpointsGrid = true;
    console.log('Clicked icon with menu:', menu);
    const params: any = {}
    params.user_id = this.User_id?.toString()


    this.apiService.post(this.urlConstant.endpointMenulist, params).subscribe((res) => {
      this.selectedApiEndpoints = res.data.api_endpoints ?? [];
      this.totalData = this.MenuData.length != 0 ? res.data.api_endpoints[0].total_records : 0
      this.MenuData.forEach((val: any) => {
      });
    }, (err: any) => {
      err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken()
        : (this.MenuData = [], this.totalData = this.MenuData.length);

    });


  }
  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

    profileImgAppend(menu_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.Client_id.toString());
      myFormData.append('file_id', menu_id);
      myFormData.append('upload_type', 'menus');
      myFormData.append('user_id', this.User_id?.toString());
      this.uploadImgService.post(this.urlConstant.uploadprofile, myFormData).subscribe(
        (res) => {
          if (res.status_code == this.statusConstants.success) {
            if (res.url != null && res.url != '') {
              // this.profileImgUpdate(res.url, menu_id);
            } else {
              this.failedToast(res);
            }
          } else {
            this.failedToast(res);
          }
        },
        (err: any) => {
          if (err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg) {
            this.apiService.RefreshToken();

          } else {
            this.failedToast(err.error);
          }
        }
      );
    }
  }

  onProfileImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.filedata = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;

      };
      reader.readAsDataURL(file);
    

    }
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }
  showAddEndpointForm() {
    this.isEditEndpoint = false;
    this.showEndpointForm = true;

  }

  showAddForm() {

    this.ShowForm = true;

  }
  cancelEndpointForm() {
    // this.resetForm();
    this.showEndpointForm = false;
    this.gridLoad();
  }

  cancelForm() {
    //  this.resetForm();
    this.ShowForm = false;
    this.gridLoad();
  }

  resetForm() {
    this.addMenuForm.reset();
    this.addEndpointForm.reset();
    this.submitted = false;
  }


  filterGlobal() {
  if (this.searchKeyword.length >= 3 || this.searchKeyword.length === 0){

    this.dt?.filterGlobal(this.searchKeyword, 'contains');
    this.first = 1;
    this.gridLoad();
  }
  }
  clear() {
    this.searchKeyword = '';
    // this.dt.clear();          
    this.gridLoad();
  }
 cancelImage() {
    this.previewUrl = null;
    this.filedata = null;

    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = ''; 
      
    } else {
      console.warn('fileInput not ready yet');
    }
  }
}


