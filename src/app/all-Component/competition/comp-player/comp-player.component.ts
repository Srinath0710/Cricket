import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
import { Tooltip } from 'primeng/tooltip';
import { ToastService } from '../../../services/toast.service';
import { Dialog } from "primeng/dialog";
import { UploadImgService } from '../../../Profile_Img_service/upload-img.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { profile } from 'console';
import { CheckboxModule } from 'primeng/checkbox';
import { ChangeDetectorRef } from '@angular/core';
interface Team {
  team_id: number;
  team_name: string;
}
@Component({
  selector: 'app-comp-player',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    ToastModule,
    Tooltip,
    Dialog,
    ImageCropperComponent,
    CheckboxModule
  ],
  templateUrl: './comp-player.component.html',
  styleUrl: './comp-player.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService },
  ],
  standalone: true
})

export class CompPlayerComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '', client_id: 0 };
  @Output() PlayerUpdated = new EventEmitter<void>();
  client_id: number = 0;
  default_img = CricketKeyConstant.default_image_url.players;
  teamsDropDown: any;
  initilized: boolean = false;
  selectedTeamData: any;
  selectedTeamId: number | null = null;
  isEditPopupVisible = false;
  public ManagePlayerForm!: FormGroup<any>;
  statusConstants = CricketKeyConstant.status_code;
  squardPlayers: any[] = [];
  filtersquardPlayers: any[] = [];
  selectedPlayer: any = null;
  selectedCount = 0;
  search_filters: string = '';
  targetPlayer: any[] = [];
  sourcePlayer: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
  sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';
  teamname: any;
  teamsData: Team[] = [];
  squadPlayerList = []
  teamID: any;
  player_id: any;
  user_id: number = Number(localStorage.getItem('user_id'));
  ImportMappingData: any;
  targetProducts: any[] = [];
  ImportData: any[] = [];
  rows: number = 10;
  totalData: any = 0;
  pageData: number = 0;
  first: number = 0;
  groundData = []
  allPlayersRaw: any[] = [];
  selectedPlayersRaw: any[] = [];
  showFilters: boolean = false;
  selectedPlayers: any[] = [];
  viewDialogVisible: boolean = false;
  PlayerData: any[] = [];

  previewUrl: string | ArrayBuffer | null = null;
  filedata: any;
  uploadedImage: string | ArrayBuffer | null = null;
  profileImages: any;
  showCropperModal = false;
  imageBase64: any = null;
  url: any;
  src: any;
  imageCropAlter: any;
  imageDefault: any;
  croppedImage: any;
  imagePreview: string | ArrayBuffer | null = null;
  imageSizeError: string = '';
  selectedImage: File | null = null;

  searchKeyword: string = '';
  filterClubType: string = '';
  filterPlayerType: string = '';
  filterBatType: string = '';
  filterBattingOrder: string = '';
  filterBowlStyle: string = '';
  filterBowlType: string = '';
  filterGenderType: string = '';

  players: any[] = [];        // original list from API
  filteredPlayers: any[] = [];

  showSourceFilters: boolean = false;
  showTargetFilters: boolean = false;

  // default_img = CricketKeyConstant.default_image_url.players;
  men_img = CricketKeyConstant.default_image_url.menimg;
  women_img = CricketKeyConstant.default_image_url.womenimg;

  importDialogVisisble: boolean = false;
  selectAllChecked: boolean = false;
  ngZone: any;
  teamFilterOptions: any[] = [];
  selectedTeamFilter: string | null = null;
  allPlayersData: any[] = [];
  showTeamFilter: boolean = false;
  selectAllAll: boolean = false;
  selectAllPlayer: boolean = false;
  selectAllTeam: boolean = false;


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
    private cd: ChangeDetectorRef

  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.gridLoad();
    this.ManagePlayerForm = this.formBuilder.group({
      player_id: ['', []],
      client_id: ['', []],
      competition_id: ['', []],
      jersey_number: ['', [Validators.required]],
      scorecard_name: ['', [Validators.required]],
      profile_url: [''],
      user_id: ['', []],
      team_id: ['', []],
      display_name: [''],
      team_name: ['', []]
    });
  }
  chooseTeam(team_id: any) {
    if (this.teamID === team_id) {
      return;
    }

    this.teamID = team_id;
    this.spinnerService.raiseDataEmitterEvent('on');
    this.filterPlayersByTeam(this.teamID);
    this.spinnerService.raiseDataEmitterEvent('off');
  }

  gridLoad(applyFilters: boolean = false) {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {};
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.search_text = this.sourceSearchKeyword.toString(),
      params.page_no = this.first.toString(),
      params.records = this.rows.toString()

    if (applyFilters) {
      // if (this.filterStatus) {
      //   params.status = this.filterStatus;
      // }
      if (this.filterPlayerType) {
        params.player_type = this.filterPlayerType;
      }
      if (this.filterGenderType) {
        params.gender_type = this.filterGenderType;
      }
      if (this.filterBatType) {
        params.bat_type = this.filterBatType;
      }
      if (this.filterBowlType) {
        params.bowl_type = this.filterBowlType;
      }
      if (this.filterClubType) {
        params.club_type = this.filterClubType;
      }
      if (this.filterBattingOrder) {
        params.batting_order = this.filterBattingOrder;
      }
      if (this.filterBowlStyle) {
        params.bowl_style = this.filterBowlStyle;
      }
    }

    this.apiService.post(this.urlConstant.compplayerlist, params).subscribe(
      (res: any) => {
        this.teamsDropDown = res.data.teams ?? [];
        this.teamsData = res.data.teams != undefined ? res.data.teams : [];
        this.allPlayersRaw = res.data.all_players ?? [];
        this.selectedPlayersRaw = res.data.selected_players ?? [];

        this.setDefaultImages(this.allPlayersRaw);
        this.setDefaultImages(this.selectedPlayersRaw);

        this.totalData = res.data.all_players[0].total_records
        if (this.teamsData.length > 0) {
          this.teamID = this.teamsData[0].team_id;
        }
        this.filterPlayersByTeam(this.teamID);
        this.spinnerService.raiseDataEmitterEvent('off');
      },
      (err: any) => {
        this.spinnerService.raiseDataEmitterEvent('off');
        this.sourcePlayer = [];
        this.targetPlayer = []
        this.failedToast(err.error);
      }
    );
  }
  filterPlayersByTeam(teamId: number) {
    if (!teamId) {
      this.sourcePlayer = this.allPlayersRaw;
      this.targetPlayer = [];
      return;
    }
    const allItemsForTeam = this.allPlayersRaw
    const selectedPlayersForTeam = this.selectedPlayersRaw.filter(
      (item: any) => item.team_id == teamId
    );
    const selectedPlayerIdsForTeam = new Set(this.selectedPlayersRaw.map((players: any) => players.player_id));
    this.sourcePlayer = allItemsForTeam.filter(
      (item: any) => !selectedPlayerIdsForTeam.has(item.player_id)
    );
    this.targetPlayer = selectedPlayersForTeam;
    const selectedTeam = this.teamsData.find(team => team.team_id === teamId);
    this.teamname = selectedTeam ? selectedTeam.team_name : '';
    this.sourceSearchKeyword = '';
    this.targetSearchKeyword = '';
    if (this.dt1) this.dt1.filterGlobal('', 'contains');
    if (this.dt2) this.dt2.filterGlobal('', 'contains');

  }
  public singleFilterFunction(arrayFilter: Array<any>, filterKey: string, byFilterValue: any) {
    return arrayFilter.filter((data: any) => data[filterKey] == byFilterValue)
  }
  addplayer() {
    const params: any = {};
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.team_id = this.teamID?.toString();
    params.player_id = this.player_id?.toString();
    params.player_list = this.targetPlayer.map((players: any) => players.player_id).join(',');
    this.apiService.post(this.urlConstant.compplayeradd, params).subscribe(
      (res: any) => {
        // this.PlayerUpdated.emit();
        this.gridLoad();
        this.successToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message
          === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() :
          this.failedToast(err.error);

      });
  }

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }
  updateplayer(): void {
    this.showCropperModal = false;
    if (!this.selectedPlayer) {
      console.error('No player selected for update!');
      return;
    }

    if (this.filedata) {
      this.profileImgAppend(this.selectedPlayer.player_id);
    } else {
      this.updatePlayersRecords(this.ManagePlayerForm.get('profile_url')?.value || '');
    }
  }

  updatePlayersRecords(url?: string): void {
    const params: any = {
      client_id: this.CompetitionData.client_id.toString(),
      user_id: this.user_id.toString(),
      team_id: this.teamID?.toString(),
      competition_id: this.CompetitionData.competition_id.toString(),
      player_id: this.selectedPlayer.player_id?.toString(),
      file_id: this.selectedPlayer.player_id?.toString(),
      scorecard_name: this.ManagePlayerForm.get('scorecard_name')?.value || '',
      jersey_number: this.ManagePlayerForm.get('jersey_number')?.value || '',
      profile_url: url || '',
    };
    params.player_list = this.targetPlayer.map((p: any) => p.player_id).join(',');

    this.apiService.post(this.urlConstant.compplayerupdate, params).subscribe(
      (res: any) => {
        // if (res.data?.profile_url) {
        //   const newUrl = res.data.profile_url;
        //   this.selectedPlayer.profile_url = newUrl.startsWith('http')
        //     ? newUrl + '?' + Math.random()
        //     : newUrl;
        // }
        this.gridLoad();
        // this.successToast(res);
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
  }


  showEditPopup(player: any) {
    this.selectedPlayer = player;
    this.ManagePlayerForm.patchValue({
      player_id: player.player_id || '',
      team_id: player.team_id || '',
      scorecard_name: player.scorecard_name || '',
      jersey_number: player.jersey_number || '',
      profile_img: player.profile_image || '',
      // profile_url: player.profile_url || '',
      team_name: player.team_name || '',
      display_name: player.player_name || player.display_name,
    });
    this.isEditPopupVisible = true;
    this.filedata = null;
  }

  closeEditPopup() {
    this.isEditPopupVisible = false;
    this.selectedPlayer = null;
  }
  moveToSource(player: any) {
    this.targetPlayer = this.targetPlayer.filter((t: any) => t.player_id !== player.player_id);
    player.display_name = player.player_name || player.display_name;
    this.sourcePlayer.push(player);
  }

  TeamInTarget(player: any): boolean {
    return this.targetPlayer?.some((t: any) => t.team_id === player.team_id);
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  moveToTarget(player: any) {
    this.sourcePlayer = this.sourcePlayer.filter(t => t !== player);
    player.player_name = player.player_name || player.display_name;

    // ✅ Ensure profile image is available
    if (!player.profile_image) {
      const gender = player.gender?.toLowerCase();
      if (gender === 'men' || gender === 'm') {
        player.profile_image = this.men_img;
      } else if (gender === 'women' || gender === 'f') {
        player.profile_image = this.women_img;
        // } else {
        //   player.profile_image = 'assets/images/player.jpg';
      }
    }

    this.targetPlayer.push(player);
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
  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.gridLoad();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    // this.showFilters = false;
  }
  applyFilters() {
    // ✅ Source filter (via API)
    if (this.showSourceFilters) {
      this.gridLoad(true);
    }

    // ✅ Target filter (local filtering)
    if (this.showTargetFilters) {
      this.targetPlayer = this.targetPlayer.filter(player =>
        (this.filterPlayerType ? player.player_role === this.filterPlayerType : true) &&
        (this.filterBatType ? player.batting_style === this.filterBatType : true) &&
        (this.filterBattingOrder ? player.batting_order === this.filterBattingOrder : true) &&
        (this.filterBowlType ? player.bowling_specialization === this.filterBowlType : true) &&
        (this.filterGenderType ? player.gender_type === this.filterGenderType : true)
      );

      if (this.dt2) this.dt2.reset();
    }

    this.showSourceFilters = false;
    this.showTargetFilters = false;
  }


  clearFilters() {
    // this.filterStatus = '';
    this.filterPlayerType = '';
    this.filterGenderType = '';
    this.filterBatType = '';
    this.filterBowlType = '';
    this.searchKeyword = '';
    this.first = 1;
    // this.gridLoad();
    // this.msgService.add({
    //   severity: 'info',
    //   summary: 'Filters Cleared',
    //   data: { image: 'assets/images/default-logo.png' },
    //   detail: 'Filters has been Cleared'
    // });
  }

  CancelFilters() {
    this.showSourceFilters = false;
    this.showTargetFilters = false;
  }

  toggleSourceFilters() {
    this.showSourceFilters = !this.showSourceFilters;
    this.showTargetFilters = false; // Close the other filter
  }

  toggleTargetFilters() {
    this.showTargetFilters = !this.showTargetFilters;
    this.showSourceFilters = false; // Close the other filter
  }

  onViewPlayer(playersid: number) {
    const params = {
      player_id: playersid.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
      user_id: String(this.user_id)
    };

    this.apiService.post(this.urlConstant.viewgroundPlayers, params).subscribe({
      next: (res) => {
        if (res.status_code === this.statusConstants.success && res.data) {
          this.selectedPlayers = res.data.players;

          this.setDefaultImages(this.selectedPlayers);

          this.viewDialogVisible = true;
        } else {
          this.failedToast(res);
        }
      },
      error: (err) => {
        console.error('Failed to fetch player details', err);
        this.failedToast(err.error);
      }
    });
  }

  getPlayersParts(fullName: string | undefined | null): { name: string } {
    if (!fullName) {
      return { name: '' };
    }

    const match = fullName.match(/^([^(]+)\s*(\(.*\))?$/);
    return {
      name: match?.[1]?.trim() || fullName
    };
  }

  cancel() {
    this.filedata = null;
    this.url = null;
    this.profileImages = null;
    this.imageCropAlter = null;
    this.imageBase64 = null;
    this.imageDefault = null;
    this.croppedImage = null
  }

  //   get visibleRecords(): number {
  //   return this.PlayerData?.length || 0;
  // }

  fileEvent(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const maxSizeKB = 500;

    if (this.ManagePlayerForm.value.profile_image !== null && this.ManagePlayerForm.value.profile_image !== '') {
      this.profileImages = null;
    }

    if (file) {
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB > maxSizeKB) {
        this.imageSizeError = 'Max.size is 500KB';
        this.imagePreview = null;
        this.selectedImage = null;
        this.filedata = this.ManagePlayerForm.get('profile_url')?.reset();
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

  saveCroppedImage(): void {
    this.profileImages = this.croppedImage;
    this.imageCropAlter = this.filedata;
    this.filedata = this.base64ToBinary(this.filedata);
    this.showCropperModal = false;
  }

  cancelImg(): void {
    this.showCropperModal = false;
    this.url = this.imageCropAlter;
    this.filedata = this.base64ToBinary(this.imageCropAlter);
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

  imageLoaded() {
    console.log('Image loaded');
  }

  cropperReady() {
    console.log('Cropper ready');
  }

  base64ToBinary(base64: string): Blob | null {
    if (!base64 || typeof base64 !== 'string' || !base64.includes(',')) {
      console.error('Invalid base64 input:', base64);
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

  profileImgAppend(player_id: any) {
    // if (!this.filedata) return;

    const myFormData = new FormData();
    if (this.filedata != null && this.filedata != '') {
      myFormData.append('imageFile', this.filedata);
      myFormData.append('client_id', this.CompetitionData.client_id.toString());
      myFormData.append('file_id', player_id);
      myFormData.append('team_id', this.teamID?.toString());
      myFormData.append('competition_id', this.CompetitionData.competition_id.toString());
      myFormData.append('upload_type', 'players');
      myFormData.append('user_id', this.user_id?.toString());

      this.uploadImgService.post(this.urlConstant.uploadCompetitionProfile, myFormData).subscribe((res) => {
        if (res.status_code == this.statusConstants.success) {
          if (res.url != null && res.url != '') {
            this.updatePlayersRecords(res.url);
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

  addCallBack(res: any) {
    this.successToast(res);
    this.gridLoad();
  }

  private setDefaultImages(players: any[]): void {
    players.forEach((val: any) => {
      if (!val.profile_image) {
        const gender = val.gender?.toLowerCase();
        if (gender === 'men' || gender === 'm') {
          val.profile_image = this.men_img;
        } else if (gender === 'women' || gender === 'f') {
          val.profile_image = this.women_img;
        } else {
          val.profile_image = 'assets/images/player.jpg';
        }
      }
    });
  }

  clearPopup(): void {
    this.ManagePlayerForm.patchValue({
      scorecard_name: '',
      jersey_number: '',
      profile_url: ''
    });
    this.filedata = null;
    this.previewUrl = null;
    this.imagePreview = null;
    this.profileImages = null;
    this.uploadedImage = null;
    this.croppedImage = null;
    this.imageSizeError = '';

    if (this.selectedPlayer) {
      this.selectedPlayer.scorecard_name = '';
      this.selectedPlayer.jersey_number = '';
      this.selectedPlayer.profile_url = '';
      this.selectedPlayer.profile_image = null;
    }
  }



  importCompetitionPlayersList(event?: any) {
    const pageNo = event ? Math.floor(event.first / event.rows) + 1 : 1;
    const pageSize = event ? event.rows : 5;

    if (!this.CompetitionData || this.teamID === null) {
      console.log('Competition!');
      return;
    }

    const params: any = {

      user_id: this.user_id?.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
      competition_id: this.CompetitionData.competition_id?.toString(),
      team_id: this.teamID?.toString(),
      page_no: pageNo.toString(),
      records: pageSize.toString(),
    };

    this.apiService.post(this.urlConstant.importcompplayerlist, params).subscribe(
      (res: any) => {
        const players = res?.data?.player_list || [];
        const selectedPlayers = res?.data?.selected_players || [];

        this.allPlayersData = players.map((p: any) => ({
          player_id: p.player_id ?? p.id ?? '',
          player_name: p.player_name ?? p.name ?? p.full_name ?? 'N/A',
          team_name: p.team_name ?? p.team ?? 'Unknown Team',
        }));
        this.ImportData = [...this.allPlayersData];
        this.targetProducts = [...selectedPlayers];

        this.totalData = res?.data?.total_records ?? this.ImportData.length;

        this.importDialogVisisble = true;
        this.cd.detectChanges();
      },
      (err: any) => {
        this.ImportData = [];
      }
    );
  }

  onTeamFilterChange(event: any) {
    const selectedTeam = event?.value ?? null;
    this.selectedTeamFilter = selectedTeam;

    if (selectedTeam) {
      this.ImportData = this.allPlayersData.filter(
        (p) => (p.team_name ?? '').trim() === selectedTeam.trim()
      );
    } else {
      this.ImportData = [...this.allPlayersData];
    }
    // this.cd.detectChanges();
  }

  openImportDialog() {
    this.importDialogVisisble = true;
    this.importCompetitionPlayersList();
  }

  toggleSelectAll(type: string): void {
    let selectedPlayers: any[] = [];

    if (this.selectAllAll) {
      selectedPlayers = [...this.ImportData];
    }
    if (this.selectAllPlayer) {
      this.ImportData.forEach(player => {
        if (!selectedPlayers.some(p => p.player_id === player.player_id)) {
          selectedPlayers.push(player);
        }
      });
    }

    if (this.selectAllTeam) {
      this.ImportData.forEach(player => {
        if (!selectedPlayers.some(p => p.player_id === player.player_id)) {
          selectedPlayers.push(player);
        }
      });
    }
    if (!this.selectAllAll && !this.selectAllPlayer && !this.selectAllTeam) {
      selectedPlayers = [];
    }
    this.targetProducts = selectedPlayers;
  }



  onCancelImport() {
    this.importDialogVisisble = false;

    // reset all checkbox states
    this.selectAllAll = false;
    this.selectAllPlayer = false;
    this.selectAllTeam = false;

    // clear selected rows
    this.targetProducts = [];
  }

  onClearImport() {
    // reset all checkbox states
    this.selectAllAll = false;
    this.selectAllPlayer = false;
    this.selectAllTeam = false;

    // clear selected rows
    this.targetProducts = [];
  }


  toggleTeamFilter() {
    this.showTeamFilter = !this.showTeamFilter;
  }

}
