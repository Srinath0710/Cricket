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
// import { ImageCroppedEvent } from 'ngx-image-cropper';
import { TooltipModule } from 'primeng/tooltip';
import { Drawer } from 'primeng/drawer';

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
    Drawer
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
  default_img: string = 'assets/images/default-player.png';
  previewUrl: string | ArrayBuffer | null = null;
  // team_short : string;
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
  profile_img: any
  first: number = 1;
  oldfirst: number = 1;
  pageData: number = 0;
  rows: number = 10;
  totalData: any = 0;
  submitted: boolean = true;
  viewMode: boolean = false;
  isEditMode: boolean = false;
  searchKeyword: string = '';
  selectedCity: string = '';
  defaultRows: number = 10;
  clientData: any[] = [];
  cities = [];
  selectedTeams:any = [];
    viewDialogVisible: boolean = false;
  countriesData: any;
  countryID: any;
  TeamsNamePattern = /^[^'"]+$/; //allstringonly allow value
  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private urlConstant: URLCONSTANT, private msgService: MessageService,
    private confirmationService: ConfirmationService, public cricketKeyConstant: CricketKeyConstant) {

  }
  ngOnInit(): void {
    this.Clientdropdown();
    this.countryDropdown();
    
    this.addTeamForm = this.formBuilder.group({
      team_id: [''],
      team_name: ['', [Validators.required]],
      team_short: [''],
      gender_id: ['', [Validators.required]],
      age_category_id: ['', [Validators.required]],
      format_id: ['', [Validators.required]],
      // team_profile: [''],
      primary_color: [''],
      secondary_color: [''],
      club_id:['',[]],
      reference_id:['',[]],
      country_id:['' ],
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
        console.log("All clubs:", this.configDataList);
      },
      (err: any) => {
        if (err.status === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();
        } else {
          this.configDataList = [];
          console.error("Error fetching clubs dropdown:", err);
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
          val.profile_img = `${val.profile_img}?${Math.random()}`;
        });
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.teamData = [], this.totalData = this.teamData.length);

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
        if (res.status && res.data) {
          this.selectedTeams = res.data.teams; // or res.data.ground based on response shape
          console.log('resteams', this.selectedTeams);
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
        res.statusConstants === this.statusConstants.success && res.status ? (this.successToast(res), this.gridLoad()) : this.failedToast(res);
      },
      (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      }
    );
  }

  StatusConfirm(team_id: number, actionObject: { key: string, label: string }, currentStatus: string) {
    const AlreadyStatestatus =
      (actionObject.key === this.conditionConstants.active_status.key && currentStatus === 'Active') ||
      (actionObject.key === this.conditionConstants.deactive_status.key && currentStatus === 'InActive');

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
    const params: any = {};
    params.action_flag = 'dropdown';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.dropdownTeam, params).subscribe((res) => {
      this.configDataList = res.data.dropdowns != undefined ? res.data : [];

      this.ageGroupList = res.data.dropdowns
        .filter((item: any) => item.config_key === 'age_category')
        .map((item: any) => ({ ...item })); 

      this.genderList = res.data.dropdowns
        .filter((item: any) => item.config_key === 'gender')
        .map((item: any) => ({ ...item }));

      this.formatList = res.data.dropdowns
        .filter((item: any) => item.config_key === 'team_format')
        .map((item: any) => ({ ...item }));

      setTimeout(() => {
        const teamId = this.addTeamForm.get('team_id')?.value;
        if (!teamId) {
          this.formSetValue();
        }
      }, 100);

    }, (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();

      }
    })
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

    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
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
        res.statusConstants === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {
      this.apiService.post(this.urlConstant.addTeam, params).subscribe((res) => {
        res.statusConstants === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }
  }

  uploadImageToAssets() {

  }

  EditTeam(team_id: number) {
    console.log("hiii",this.showAddForm())
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.team_id = team_id?.toString();
    this.apiService.post(this.urlConstant.editTeam, params).subscribe((res) => {
      if (res.statusConstants == 200) {
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

            // team_profile: null
          });
          console.log(this.showAddForm())

          this.showAddForm();
        }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
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
      console.log(this.client_id);
      this.gridLoad();
      this.getGlobalData();

    }, (err) => {
      if (err.status === 401 && err.error.message === 'Token expired') {
        this.apiService.RefreshToken();
      }
    });
  }

}