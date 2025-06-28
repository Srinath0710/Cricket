import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

interface MetaInfo {
  config_key: string;
  config_id: number;
  config_name: string;
}

@Component({
  selector: 'app-comp-match',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    TooltipModule
  ],
  templateUrl: './comp-match.component.html',
  styleUrl: './comp-match.component.css',
  providers :[  
  { provide: CricketKeyConstant },
  ]
})
export class CompMatchComponent implements OnInit {
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '' };
  public ShowForm: any = false;
  public competitionFixturesForm !: FormGroup<any>;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  submitted: boolean = false
  configDataList: MetaInfo[] = [];
  timezonetype = [];
  competition: any = []
  matchgroup = [];
  matchstage = [];
  daytype = [];
  teamlist = [];
  groundlist = [];
  official = [];
  addoneAnother = '';
  MatchData: any = []
  viewMode: boolean = false;
  match_id: any;
  away_team_list: any = []
  umpire_list: any = []
  video_analyst_list: any = []
  scorer_list: any = []
  referee: any;
  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;
  default_img = CricketKeyConstant.default_image_url.teamimage;
  
  @Output() showFormChange = new EventEmitter<boolean>();

  constructor(
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    public cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit(): void {
    this.initForm();
    this.gridload();
    this.getDropdown()
  }

  initForm() {
    this.competitionFixturesForm = this.formbuilder.group({

      sequence_no: ['', [Validators.required]],
      match_name: ['', [Validators.required]],
      match_overs: ['', []],
      match_start_date: ['',[Validators.required]],
      match_end_date: ['',[Validators.required]],
      time_zone_id: ['', []],
      day_type: ['', []],
      is_neutral_venue: ['', []],
      team_1_code: ['', []],
      team_2_code: ['', []],
      ground_id: ['', []],
      match_group_id: ['', []],
      match_phase_id: ['', []],
      umpire_1: ['', []],
      umpire_2: ['', []],
      umpire_3: ['', []],
      umpire_4: ['', []],
      referee_id: ['', []],
      sr_video: ['', []],
      jr_video: ['', []],
      manual_scorer_id: ['', []],
      digital_scorer_id: ['', []],
      local_video_path: ['', []],
      match_id:['']

    })
  }

  gridload() {
    const params: any = {}
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.competition_id=String( this.CompetitionData?.competition_id),

    this.apiService.post(this.urlConstant.getfixture, params).subscribe((res) => {

      if (res.data && res.data.fixtures) {
        this.MatchData = res.data.fixtures;
      } else {
        this.MatchData = [];
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : (this.MatchData = []);

    });
  }
  showDialog() {
    this.ShowForm = true;
    this.showFormChange.emit(this.ShowForm); 
    this.resetForm();
  }

  cancelForm() {
    this.ShowForm = false;
  }

  resetForm() {
    this.competitionFixturesForm.reset();
    if(this.competitionFixturesForm.get('match_id')?.value ==''|| this.competitionFixturesForm.get('match_id')?.value ==null){

    setTimeout(() => {
        this.competitionFixturesForm.patchValue({
          // day_type: this.daytype.filter((val: any) => val.config_key == 'D')?.[0].config_id ?? null,
          sequence_no: this.competition?.[0]?.sequence_no ?? '',
          time_zones: this.competition?.[0]?.time_zone_id ?? null,
          match_start_date: this.competition?.[0]?.start_date.split('T')?.[0] ?? null,
          match_end_date: this.competition?.[0]?.start_date.split('T')?.[0] ?? null,
          match_overs: this.competition?.[0]?.overs ?? 20,
          // home_team : this.competition[0]?.is_bilateral == 1 ?this.CompetitionEditRecord?.home_team_id : null,
          // away_team : this.competition[0]?.is_bilateral == 1 ?this.CompetitionEditRecord?.away_team_id : null
        })
     
    }, 10)
  }
    this.submitted = false;
  }

  getDropdown() {
    const params: any = {}
    params.action_flag = "drop_down"
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.fixturedropdown, params).subscribe(
      (res: any) => {
        var response = res.status_code == '200' ? true : false;
        this.timezonetype = response ? res.data.time_zones : []
        this.competition = response ? res.data.competitions : []

        this.matchgroup = res.data.metadata
          .filter((item: any) => item.config_key === 'match_group')
          .map((item: any) => ({ ...item }));

        this.matchstage = res.data.metadata
          .filter((item: any) => item.config_key === 'match_stage')
          .map((item: any) => ({ ...item }));

          this.daytype = res.data.metadata
          .filter((item: any) => item.config_key === 'day_type')
          .map((item: any) => ({ ...item }));

         this.teamlist = response ? res.data.teams : []
        this.groundlist = response ? res.data.grounds : []
        this.official = response ? res.data.officials : []

 

        this.umpire_list = response ? res.data.officials.filter((temp:any) => temp.official_type === 'Umpire') : []
        this.video_analyst_list = response ? res.data.officials.filter((temp:any) => temp.official_type === 'Analyst') : []
        this.scorer_list = response ? res.data.officials.filter((temp:any) => temp.official_type === 'Scorer') : []
        this.referee = response ? res.data.officials.filter((temp:any) => temp.official_type === 'Referee') : []
        this.resetForm();


      }, (err: any) => {
        if (err.status_code === 401 && err.error.message === "Expired") {
          this.apiService.RefreshToken();

        }
      })
  }

  hideDialog() {

    this.ShowForm = false
  }
    /* Failed Toast */
    failedToast(data: any) {
      this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
    }
    successToast(data: any) {
      this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });
  
    }

    addCallBack(res: any) {
      this.resetForm();
      this.cancelForm();
      this.gridload();
      this.successToast(res);

    }

  addFixtures() {
    this.submitted = true;
    if (!this.competitionFixturesForm.valid) {
      this.competitionFixturesForm.markAllAsTouched();
      return
    }
  
    const params: any = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      competition_id: this.CompetitionData?.competition_id != null ? String(this.CompetitionData.competition_id) : null,
      match_id: this.competitionFixturesForm.value.match_id != null ? String(this.competitionFixturesForm.value.match_id) : null,
    
      match_name: this.competitionFixturesForm.value.match_name ?? null,
      match_overs: this.competitionFixturesForm.value.match_overs != null ? String(this.competitionFixturesForm.value.match_overs) : null,
      time_zone_id: this.competitionFixturesForm.value.time_zone_id != null ? String(this.competitionFixturesForm.value.time_zone_id) : null,
      day_type: String(this.competitionFixturesForm.value.day_type ?? null),
     
      team_1_code: this.competitionFixturesForm.value.team_1_code != null ? String(this.competitionFixturesForm.value.team_1_code) : null,
      team_2_code: this.competitionFixturesForm.value.team_2_code != null ? String(this.competitionFixturesForm.value.team_2_code) : null,
      ground_id: this.competitionFixturesForm.value.ground_id != null ? String(this.competitionFixturesForm.value.ground_id) : null,
      match_group_id: this.competitionFixturesForm.value.match_group_id != null ? String(this.competitionFixturesForm.value.match_group_id) : null,
      match_phase_id: this.competitionFixturesForm.value.match_phase_id != null ? String(this.competitionFixturesForm.value.match_phase_id) : null,
      
      umpire_1: this.competitionFixturesForm.value.umpire_1 != null ? String(this.competitionFixturesForm.value.umpire_1) : null,
      umpire_2: this.competitionFixturesForm.value.umpire_2 != null ? String(this.competitionFixturesForm.value.umpire_2) : null,
      umpire_3: this.competitionFixturesForm.value.umpire_3 != null ? String(this.competitionFixturesForm.value.umpire_3) : null,
      umpire_4: this.competitionFixturesForm.value.umpire_4 != null ? String(this.competitionFixturesForm.value.umpire_4) : null,
      referee_id: this.competitionFixturesForm.value.referee_id != null ? String(this.competitionFixturesForm.value.referee_id) : null,
      
      sr_video: this.competitionFixturesForm.value.sr_video ?? null,
      jr_video: this.competitionFixturesForm.value.jr_video ?? null,
      manual_scorer_id: this.competitionFixturesForm.value.manual_scorer_id != null ? String(this.competitionFixturesForm.value.manual_scorer_id) : null,
      digital_scorer_id: this.competitionFixturesForm.value.digital_scorer_id != null ? String(this.competitionFixturesForm.value.digital_scorer_id) : null,
      local_video_path: this.competitionFixturesForm.value.local_video_path ?? null,
      
      sequence_no: this.competitionFixturesForm.value.sequence_no != null ? String(this.competitionFixturesForm.value.sequence_no) : null,
      
      match_start_date: this.competitionFixturesForm.value.match_start_date
      ? String(this.competitionFixturesForm.value.match_start_date).replace("T", " ")
      : null,
    
    match_end_date: this.competitionFixturesForm.value.match_end_date
      ? String(this.competitionFixturesForm.value.match_end_date).replace("T", " ")
      : null,
    
      action_flag: 'create',

    }
    if (this.competitionFixturesForm.controls['is_neutral_venue'].value == "1") {
      params.is_neutral_venue = "1"
    }
    else {
      params.is_neutral_venue = "0"
    }
   
    if (this.competitionFixturesForm.value.match_id){
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updatefixture, params).subscribe(
        (res) => {
          if (res.status_code == 200) {
            if (this.addoneAnother == 'another') {
              this.addoneAnother = ''
              this.getDropdown();
              this.addCallBack(res);
              

            } else {
              this.apiService.feedSummary(this.user_id, this.client_id, this.CompetitionData.competition_id)

              this.gridload()
              this.hideDialog()
            }
          }

        }, (err: any) => {
          if (err.status_code === 401 && err.error.message === "Expired") {
            this.apiService.RefreshToken();

          }

        })
    }

    else {
      this.apiService.post(this.urlConstant.addfixture, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }
}

editCardData(match_id: number){
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.match_id= match_id.toString(), 
    this.apiService.post(this.urlConstant.editfixture, params).subscribe((res) => {
      if (res.status_code == 200) {
        const editRecord: any = res.data.fixtures[0] ?? {};
        if (editRecord != null) {
          this.competitionFixturesForm.setValue({
            match_id: editRecord.match_id,
            match_name: editRecord.match_name,
            match_overs: editRecord.match_overs,
            match_start_date: editRecord.match_start_date!=null ?editRecord.match_start_date.split('T')[0] :null,
            match_end_date: editRecord.match_end_date!=null ?editRecord.match_end_date.split('T')[0] :null,
            time_zone_id: editRecord.time_zone_id,
            day_type: editRecord.day_type,
            is_neutral_venue: editRecord.is_neutral_venue,
            team_1_code: editRecord.team_1_code,
            team_2_code: editRecord.team_2_code,
            ground_id: editRecord.ground_id,
            // description: editRecord.description ,
            match_group_id: editRecord.match_group_id,
            match_phase_id:  editRecord.match_phase_id,
            umpire_1:  editRecord.umpire_1,
            umpire_2:  editRecord.umpire_2,
            umpire_3:  editRecord.umpire_3,
            umpire_4:  editRecord.umpire_4,
            referee_id:  editRecord.match_phase_id,
            sr_video:  editRecord.sr_video,
            jr_video:  editRecord.jr_video,
            manual_scorer_id:  editRecord.manual_scorer_id,
            digital_scorer_id:  editRecord.digital_scorer_id,
            local_video_path:  editRecord.local_video_path,
            sequence_no:  editRecord.sequence_no,
          });
          this.ShowForm = true;
           }
      } else {
        this.failedToast(res);
      }
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
    });


  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  StatusConfirm(match_id: number) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Match?`,
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.urlConstant.deactivefixture;
        this.status(match_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  
  status(match_id: number, url: string) {
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      match_id: match_id?.toString(),
      competition_id: String(this.CompetitionData?.competition_id)
    };
  
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        res.status_code === this.statusConstants.success && res.status
          ? (this.successToast(res), this.gridload())
          : this.failedToast(res);
      },
      (err: any) => {
        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err.error);
      }
    );
  }
  
}