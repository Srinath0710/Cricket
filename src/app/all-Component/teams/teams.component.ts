import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { URLCONSTANT } from '../../services/url-constant';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { EditTeam, Teams, UpdateTeams } from './teams.model';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { TooltipModule } from 'primeng/tooltip';
import { Drawer } from 'primeng/drawer';
import { environment } from '../../environments/environment';

interface Team {
  config_id: string;
}

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    InputTextModule,
    PaginatorModule,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    Drawer,
    ImageCropperComponent
  ],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
})
export class TeamsComponent implements OnInit {

    showPopup: boolean = true;
  public addTeamForm!: FormGroup<any>;
  @ViewChild('dt') dt: Table | undefined;

  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  public ShowForm: any = false;
  teamData: Teams[] = [];
  uploadedImage: string | ArrayBuffer | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  configDataList: Team[] = [];
  ageGroupList: Team[] = [];
  genderList: Team[] = [];
  formatList: Team[] = [];
  allTeamData: Teams[] = [];
  showCropperModal = false;
  imageBase64: any = null;
  filedata: any;
  profileImages: any;
  imageCropAlter: any;
  imageDefault: any;
  url: any;
  src: any;
  team_profile: any
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  submitted: boolean = true;
  viewMode: boolean = false;
  searchKeyword: string = '';
  selectedCity: string = '';
  defaultRows: number = 10;
  clientData: any[] = [];
  isClientShow:boolean=false;
  cities = [];
  selectedTeams:any = [];
    viewDialogVisible: boolean = false;
  countriesData: any;
  countryID: any;
  TeamsNamePattern = /^[^'"]+$/; //allstringonly allow value
  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;
  dropDownConstants=CricketKeyConstant.dropdown_keys;
  envImagePath = environment.imagePath;
  default_flag_img = this.envImagePath + '/images/Default Flag.png';
  default_img = CricketKeyConstant.default_image_url.officials;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant) {

  }
  ngOnInit(): void {
    this.Clientdropdown();
    this.countryDropdown();
    
    this.addTeamForm = this.formBuilder.group({
      team_id: [''],
      team_name: ['', [Validators.required]],
      team_short: ['', [Validators.required]],
      gender_id: ['', [Validators.required]],
      age_category_id: ['', [Validators.required]],
      format_id: ['', [Validators.required]],
      team_profile: [''],
      primary_color: [''],
      secondary_color: [''],
      club_id:['', [Validators.required]],
      reference_id:['', [Validators.required]],
      country_id:['', [Validators.required]],
      
    })
  }



   clubsdropdown() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };

    this.apiService.post(this.urlConstant.playerclubdropdown, params).subscribe(
      (res) => {
        this.configDataList = res.data?.clubs || [];
      },
      (err: any) => {
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error?.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        } else {
          this.failedToast(err.error);
        }
      }
    );
  }
//single quotes and doble quotes remove all label box 
blockQuotesOnly(event: KeyboardEvent) {
  if (event.key === '"' || event.key === "'") {
    event.preventDefault();
  }
}


sanitizeQuotesOnly(controlName: string, event: Event) {
  const input = (event.target as HTMLInputElement).value;
  const cleaned = input.replace(/['"]/g, ''); // remove ' and "
  this.addTeamForm.get(controlName)?.setValue(cleaned, { emitEvent: false });
}


  gridLoad() {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.page_no = this.first.toString();
    params.records = this.rows.toString();
    params.search_text = this.searchKeyword.toString(),
      this.apiService.post(this.urlConstant.getTeamList, params).subscribe((res) => {
        if (res.data?.teams) {
          this.teamData = res.data.teams;
          this.totalData = this.teamData.length !== 0 ? res.data.teams[0].total_records : 0;
          this.clubsdropdown();
        } else {
          this.teamData = [];
          this.totalData = 0;
        }
        this.teamData.forEach((val: any) => {
          val.team_profile = `${val.team_profile}?${Math.random()}`;
        });
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.teamData = [], this.totalData = this.teamData.length);

      });

  }


  onViewGroundDetails(teamsid: any) {
    const params = {
      team_id: teamsid.toString(),
      client_id: this.client_id?.toString(),
      user_id: String(this.user_id)
    };

    this.apiService.post(this.urlConstant.viewgroundTeams, params).subscribe({
      next: (res) => {
        if (res.status_code && res.data) {
          this.selectedTeams = res.data.teams; 
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch ground details', err);
      }
    });
  }

  closePopup() {
    this.showPopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }
  calculateFirst(): number {
    return (this.first - 1) * this.rows;
  }
  onPageChange(event: any) {
    this.first = (event.page) + 1;
    this.pageData = event.first;
    this.rows = event.rows;
    this.gridLoad();
  }
  showAddForm() {
    this.ShowForm = true;
  }

  cancelForm() {
    this.ShowForm = false;
  }
  resetForm() {

    this.addTeamForm.reset();
    this.submitted = false;
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    console.log(data)
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }

  status(team_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      team_id: team_id?.toString()
    };
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      }
    );
  }

  StatusConfirm(team_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === this.conditionConstants.active_status.status) ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === this.conditionConstants.deactive_status.status);

    if (AlreadyStatestatus) {
      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this team?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key ? this.urlConstant.activeTeam : this.urlConstant.deactiveTeam;
        this.status(team_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }

  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.gridLoad();
  }
  getGlobalData() {
    const params: any = {
      action_flag: 'dropdown',
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString()
    };
  
    this.apiService.post(this.urlConstant.dropdownTeam, params).subscribe(
      (res) => {
        const dropdowns = Array.isArray(res.data?.dropdowns) ? res.data.dropdowns : [];
        this.ageGroupList = dropdowns.filter((item: any) => item.config_key === this.dropDownConstants.config_key.age_category);
        this.genderList = dropdowns.filter((item: any) => item.config_key === this.dropDownConstants.config_key.gender);
        this.formatList = dropdowns.filter((item: any) => item.config_key === this.dropDownConstants.config_key.team_format);
      },
      (err: any) => {
        this.ageGroupList = [];
        this.genderList = [];
        this.formatList = [];
      }
    );
  }
  

  formSetValue() {
    this.addTeamForm.patchValue({
      gender_id: this.genderList[0].config_id,
      format_id: this.formatList[0].config_id,
      ageGroup: this.ageGroupList[0].config_id
    })
  }

  countryDropdown() {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString()
    };
    this.apiService.post(this.urlConstant.teamcountrydropdown, params).subscribe((res) => {
      this.countriesData = res.data.countries ?? [];
      this.countryID = this.countriesData[0].country_id;
      this.gridLoad();

    },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      
    });
  }

  onAddTeam() {
    this.submitted = true;
    if (this.addTeamForm.invalid) {
      this.addTeamForm.markAllAsTouched();
      return
    }
    const params: UpdateTeams = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      team_name: this.addTeamForm.value.team_name,
      team_short: this.addTeamForm.value.team_short,
      gender_id: String(this.addTeamForm.value.gender_id),
      age_category_id: String(this.addTeamForm.value.age_category_id),
      format_id: String(this.addTeamForm.value.format_id),
      team_id: String(this.addTeamForm.value.team_id),
      club_id: String(this.addTeamForm.value.club_id),
      reference_id: String(this.addTeamForm.value.reference_id),
      country_id:String(this.addTeamForm.value.country_id),
      action_flag: 'create',
    };
    if (this.addTeamForm.value.team_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateTeam, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    } else {
      this.apiService.post(this.urlConstant.addTeam, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
      });
    }
  }

  EditTeam(team_id: number) {
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.team_id = team_id?.toString();
    this.apiService.post(this.urlConstant.editTeam, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status) {
        const editRecord: EditTeam = res.data.teams[0] ?? {};
        if (editRecord != null) {
          this.addTeamForm.setValue({
            team_id: editRecord.team_id,
            team_short: editRecord.team_short,
            team_name: editRecord.team_name,
            gender_id: editRecord.gender_id,
            age_category_id: editRecord.age_category_id,
            format_id: editRecord.format_id,
            primary_color: editRecord.primary_color,
            secondary_color: editRecord.secondary_color,
            club_id: editRecord.club_id,
            reference_id: editRecord.reference_id,
            country_id: editRecord.country_id,
            team_profile: editRecord.team_profile
          });
        }
      } 
    });
    this.showAddForm();

  }

  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
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

  filterGlobal() {
    this.first = 1;
    this.gridLoad();
  }
  clear(table: Table) {
    table.clear();
    this.searchKeyword = '';
    this.gridLoad();
  }
  onEnterPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.filterGlobal();
  }
  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id = this.clientData[0].client_id;
      this.isClientShow=this.clientData.length>1?true:false;
      this.gridLoad();
      this.getGlobalData();

    }, (err) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }

  fileEvent(event: any) {
    if (this.addTeamForm.value.team_profile.value !== null && 
      this.addTeamForm.value.team_profile.value !== '') {
      this.profileImages = null;
    }
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.filedata = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        var img = new Image;
        this.url = event.target.result;
        this.imageCropAlter = event.target.result
        this.imageDefault = event.target.result
      }
    } else {
      this.filedata = null;
      this.url = this.imageDefault
      this.filedata = this.base64ToBinary(this.imageDefault);

    }
  }
  saveCroppedImage(): void {
    this.profileImages = this.filedata;
    this.imageCropAlter = this.filedata;
    this.filedata=this.base64ToBinary(this.filedata);
    this.showCropperModal = false;
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.url=this.imageCropAlter;
    this.filedata=this.base64ToBinary(this.imageCropAlter);
  }
  loadImageFailed() {
    console.error('Image loading failed');
  }


  imageCropped(event: ImageCroppedEvent) {
    this.url = event.base64
    this.filedata = event.base64
     this.profileImages=null
  }
  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  base64ToBinary(base64:any){
    const byteCharacters = atob(base64.split(',')[1]); 
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset++) {
        byteArrays.push(byteCharacters.charCodeAt(offset));
    }

    const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/jpeg' }); 
    return blob;
}
convertUrlToBase64(imageUrl: string): void {
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.blob();
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result as string; 
          this.imageBase64 = base64Image; 
          this.imageCropAlter=base64Image
          this.imageDefault=base64Image
        };
        reader.readAsDataURL(blob); 
      })
      .catch((error) => {
      });
  }
  cancel() {
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter=null;
    this.imageBase64 = null;
}
  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64=this.imageDefault;
  }
}