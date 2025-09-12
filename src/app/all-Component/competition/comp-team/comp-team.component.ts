import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
import { Table, TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToastService } from '../../../services/toast.service';
import { DialogModule } from 'primeng/dialog';
import { UploadImgService } from '../../../Profile_Img_service/upload-img.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
@Component({
  selector: 'app-comp-team',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    TooltipModule,
    DialogModule,
    ImageCropperComponent

  ],
  templateUrl: './comp-team.component.html',
  styleUrl: './comp-team.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
  standalone: true

})
export class CompTeamComponent implements OnInit {
  [x: string]: any;
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '', client_id: 0 };
  @Output() TeamUpdate = new EventEmitter<void>();
  client_id: number = 0;
  user_id: number = Number(localStorage.getItem('user_id'));
  team_id: any;
  public compTeamsList = [];
  public ManageTeamsForm!: FormGroup;
  isEditPopupVisible = false;
  selectedTeam: any = null;
  default_img = CricketKeyConstant.default_image_url.teamimage;
  statusConstants = CricketKeyConstant.status_code;
  teams: any[] = []
  popUpTeamList: any[] = [];
  targetTeams: any[] = [];
  sourceTeams: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
  sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';
  selectedTeams: any = [];
  viewDialogVisible: boolean = false;
  rows: number = 10;
  totalData: any = 0;
  pageData: number = 0;
  first: number = 0;

  filedata: any;
  url: any;
  src: any;
  profileImages: any;
  previewUrl: string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  profileImagePreview: string | ArrayBuffer | null = null;
  currentEditedImage: string | ArrayBuffer | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  imageSizeError: string = '';
  selectedImage: File | null = null;
  imageCropAlter: any;
  imageDefault: any;
  imageBase64: any = null;
  showCropperModal: boolean = false;
  croppedImage: any;


  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private formBuilder: FormBuilder,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
    private uploadImgService: UploadImgService,
  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.gridLoad();
    this.ManageTeamsForm = this.formBuilder.group({
      team_name: [''],
      team_id: ['', [Validators.required]],
      ground_list: ['', []],
      client_id: ['', [Validators.required]],
      competition_id: ['', [Validators.required]],
      sponser_name: ['', [Validators.required]],
      scorecard_name: ['', [Validators.required]],
      profile_url: [''],
    })

  }

  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {};
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.search_text = this.sourceSearchKeyword.toString(),
      params.records = this.rows.toString();
    params.page_no = (Math.floor(this.first / this.rows) + 1).toString();
    this.apiService.post(this.urlConstant.compTeamsList, params).subscribe(
      (res: any) => {
        const allItems = res.data.all_teams.map((val: any) => ({
          ...val,
          scorecard: ''
        }));
        const mappedIds = res.data.selected_teams.map((value: any) => value.team_id);
        this.sourceTeams = allItems.filter((item: any) => !mappedIds.includes(item.team_id));
        this.targetTeams = res.data.selected_teams.map((val: any) => {
          const existing = this.targetTeams.find(t => t.team_id === val.team_id);

          return {
            ...val,
            profile_url: val.profile_url
              ? (val.profile_url.startsWith('http')
                ? val.profile_url + '?' + Math.random()
                : val.profile_url) // keep base64 intact
              : (existing?.profile_url || this.default_img),

          };
        });


        this.totalData = res.data.all_teams[0]
        this.spinnerService.raiseDataEmitterEvent('off');
      },

      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.spinnerService.raiseDataEmitterEvent('off'), this.sourceTeams = [], this.targetTeams = []);
      });
    this.spinnerService.raiseDataEmitterEvent('off');
  }

  popUpTeamsData() {
    this.spinnerService.raiseDataEmitterEvent('on');
    setTimeout(() => {
      this.popUpTeamList = this.sourceTeams;
      this.spinnerService.raiseDataEmitterEvent('off');

    }, 100)
  }
  // filterTeams() {
  //   const search = this.searchText.toLowerCase();
  //   this.filteredTeams = this.teams.filter(team =>
  //     team.team_name.toLowerCase().includes(search)
  //   );
  // }

  // clearSearch() {
  //   this.searchText = '';
  //   this.filteredTeams = [...this.teams];
  // }

  AddTeam() {
    const params: any = {}
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.team_list = this.targetTeams.map((p: any) => p.team_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.profileImages = this.profileImages;
    params.filedata = this.filedata;
    // params.profile_url = this.profileImages.toString();
    // params.profile_url = this.ManageTeamsForm.profile_url.toString();
    this.apiService.post(this.urlConstant.compTeamadd, params).subscribe((res: any) => {
      // this.TeamUpdate.emit();
      this.gridLoad();
      this.successToast(res);
    },
      (err: any) => {
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        }
        this.spinnerService.raiseDataEmitterEvent('off');
        this.failedToast(err.error);
      })
  }

  updateTeam(): void {
    this.showCropperModal = false;
    if (!this.selectedTeam) {
      console.error('No team selected for update!');
      return;
    }

    const params: any = {
      user_id: this.user_id.toString(),
      client_id: this.CompetitionData.client_id.toString(),
      competition_id: this.CompetitionData.competition_id.toString(),
      file_id: this.selectedTeam.team_id?.toString(),
      team_id: this.selectedTeam.team_id?.toString(),
      scorecard_name: this.ManageTeamsForm.get('scorecard_name')?.value || '',
      sponser_name: this.ManageTeamsForm.get('sponser_name')?.value || '',
      profile_url: this.ManageTeamsForm.get('profile_url')?.value || '',
    };

    this.apiService.post(this.urlConstant.compTeamsUpdate, params).subscribe(
      (res: any) => {
        if (res.data?.profile_url) {
          const newUrl = res.data.profile_url;
          this.selectedTeam.profile_url = newUrl.startsWith('http')
            ? newUrl + '?' + Math.random()
            : newUrl;
        }

        this.gridLoad();
        this.successToast(res);

        this.closeEditPopup();

      },
      (err: any) => {
        if (
          err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg
        ) {
          this.apiService.RefreshToken();
        }
        this.spinnerService.raiseDataEmitterEvent('off');
        this.failedToast(err.error);
      }
    );
    // this.filedata = null;
    // this.profileImages = this.updateTeam.country_image + '?' + Math.random();
    // this.convertUrlToBase64(editRecord.country_image + '?' + Math.random());
  }


  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }
  onMoveToTarget(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = true;
    });
  }

  moveToSource(team: any) {
    this.targetTeams = this.targetTeams.filter((t: any) => t.team_id !== team.team_id);
    this.sourceTeams.push(team);
  }

  moveToTarget(team: any) {
    this.sourceTeams = this.sourceTeams.filter(t => t !== team);
    this.targetTeams.push(team);
  }

  /* For Edit button hidden in target teams*/
  TeamInTarget(teams: any): boolean {
    return this.targetTeams?.some((t: any) => t.team_id === teams.team_id);
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }


  showEditPopup(team: any) {
    this.isEditPopupVisible = true;
    this.filedata = null;
    this.selectedTeam = team;
    this.profileImages = team.profile_url || team.profile_img || null;
    this.ManageTeamsForm.patchValue({
      scorecard_name: team.scorecard_name || '',
      sponser_name: team.sponser_name || '',
      team_id: team.team_id || '',
      team_name: team.team_name || '',
      profile_url: team.profile_url || ''
    });
  }

  closeEditPopup() {
    this.isEditPopupVisible = false;
    this.selectedTeam = null;
  }

  filterGlobalSource($event: any, stringVal: string) {
    this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  filterGlobalTarget($event: any, stringVal: string) {
    this.dt2?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  clearSource(table: Table) {
    table.clear();
    this.sourceSearchKeyword = '';
  }

  clearTarget(table: Table) {
    table.clear();
    this.targetSearchKeyword = '';
  }
  onViewteam(teamsid: number) {
    const params = {
      team_id: teamsid.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
      user_id: String(this.user_id)
    };

    this.apiService.post(this.urlConstant.viewgroundTeams, params).subscribe({
      next: (res) => {
        if (res.status_code && res.data) {
          this.selectedTeams = res.data.teams;
          this.selectedTeams.forEach((teams: any) => {
            teams.profile_url = teams.profile_url + '?' + Math.random();
          });
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch ground details', err);
      }
    });
  }
  getTeamNameParts(fullName: string): { name: string, category: string } {
    const match = fullName.match(/^([^(]+)\s*(\(.*\))?$/);
    return {
      name: match?.[1]?.trim() || '',
      category: match?.[2] || ''
    };
  }
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.gridLoad();
  }

  fileEvent(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const maxSizeKB = 500;

    if (this.ManageTeamsForm.value.team_profile !== null && this.ManageTeamsForm.value.team_profile !== '') {
      this.profileImages = null;
    }

    if (file) {
      const fileSizeKB = file.size / 500;
      if (fileSizeKB > maxSizeKB) {
        this.imageSizeError = 'Max.size is 500KB';
        this.imagePreview = null;
        this.selectedImage = null;
        this.filedata = null;
        this.ManageTeamsForm.get('team_profile')?.reset();
        return;
      }

      this.imageSizeError = '';
      this.filedata = file;
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        this.url = result;
        this.imageCropAlter = result;
        this.imageDefault = result;
        this.imagePreview = result;
      };
      reader.readAsDataURL(file);
    } else {
      this.filedata = null;
      this.url = this.imageDefault;
      this.imagePreview = this.imageDefault;
      this.filedata = this.base64ToBinary(this.imageDefault);
    }
  }
  base64ToBinary(base64: string): Blob | null {
    if (!base64 || typeof base64 !== 'string' || !base64.includes(',')) {
      console.error('Invalid base64 string');
      return null;
    }

    try {
      const byteCharacters = atob(base64.split(',')[1]);
      const byteArrays = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays[i] = byteCharacters.charCodeAt(i);
      }

      return new Blob([byteArrays], { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting base64 to binary:', error);
      return null;
    }
  }

  profileImgAppend(team_id: any) {
    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.CompetitionData.client_id.toString());
      myFormData.append('user_id', this.user_id?.toString());
      myFormData.append('file_id', team_id);
      myFormData.append('team_id', team_id);
      myFormData.append('upload_type', 'team');
      this.uploadImgService.post(this.urlConstant.compTeamsUpdate, myFormData).subscribe((res: any) => {
        if (res.status_code == this.statusConstants.success) {
          if (res.url != null && res.url != '') {
            // Update the selected team profile image immediately
            // this.selectedTeam.profile_url = res.url + '?' + Math.random();

            // Also update the grid list so UI refreshes instantly
            this.targetTeams = this.targetTeams.map((team: any) => {
              if (team.team_id === this.selectedTeam.team_id) {
                return { ...team, profile_url: this.selectedTeam.profile_url };
              }
              return team;
            });

            this.addCallBack(res);
          } else {
            this.failedToast(res);
          }
        } else {
          this.failedToast(res);
        }
      });
    }
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
          this.imageCropAlter = base64Image
          this.imageDefault = base64Image
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
      });
  }
  
  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  cropPopOpen() {
    this.showCropperModal = true;
    this.imageBase64 = this.imageDefault;
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject('Failed to convert Blob to base64');
      };

      reader.readAsDataURL(blob);
    });
  }

  loadImageFailed() {
    console.error('Image loading failed');
  }
  imageCropped(event: ImageCroppedEvent) {
    const blob = event.blob;
    if (blob) {
      this.convertBlobToBase64(blob).then((base64) => {
        this.url = base64;
        this.filedata = base64;
        this.profileImages = null;
      }).catch((error) => {
        console.error('Failed to convert blob to base64:', error);
      });
    }
  }

  onImageUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }

  saveCroppedImage(): void {
    this.profileImages = this.croppedImage;
    this.imageCropAlter = this.filedata;
    this.filedata = this.base64ToBinary(this.filedata);
    this.showCropperModal = false;
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

  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.filedata);
  }

  cancel() {
    this.filedata = null;
    this.url = null;
    this.imageBase64 = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageDefault = null;
    this.croppedImage = null;
  }

  clear() {
    this.cancel();
    this.profileImagePreview = null;
    this.imageSizeError = '';
    this.selectedImage = null;
    this.filedata = null;
    this.url = null;
    this.ManageTeamsForm.patchValue({
      scorecard_name: '',
      sponser_name: '',
      profile_url: ''
    });
  }

  addCallBack(res: any) {
    this.successToast(res);
    this.gridLoad();
  }
}
