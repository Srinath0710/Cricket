import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { ManageDataItem } from '../competition.component';

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
      match_start_date: ['', []],
      match_end_date: ['', []],
      time_zone_id: ['', []],
      day_type: ['', []],
      // is_neutral_venue: ['', []],
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
    params.competition_id=String( this.CompetitionData.competition_id),

    this.apiService.post(this.urlConstant.getfixture, params).subscribe((res) => {
      this.MatchData = res.data.fixtures ?? [];
      // this.teamData.forEach((val: any) => {

      // });
    }, (err: any) => {
      err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : (this.MatchData = []);
        // , this.totalData = this.teamData.length);

    });
  }
  showDialog() {
    this.ShowForm = true;
    this.resetForm();
  }

  cancelForm() {
    this.ShowForm = false;
  }
  resetForm() {
    this.submitted = false;
    this.competitionFixturesForm.reset();
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

 

        // this.umpire_list = response ? res.data.officials.filter(temp => temp.official_category === 'Umpire') : []
        // this.video_analyst_list = response ? res.data.officials.filter(temp => temp.official_category === 'Video Analyst') : []
        // this.scorer_list = response ? res.data.officials.filter(temp => temp.official_category === 'Scorer') : []
        // this.referee = response ? res.data.officials.filter(temp => temp.official_category === 'Referee') : []
        this.resetForm();


      }, (err: any) => {
        if (err.status === 401 && err.error.message === "Expired") {
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
    console.log(this.competitionFixturesForm)
    this.submitted = true;
    if (!this.competitionFixturesForm.valid) {
      this.competitionFixturesForm.markAllAsTouched();
      return
    }
  
    // if (this.competitionFixturesForm.value.is_super_over == '1' || this.competitionFixturesForm.value.has_super_over == '0') {
    //   this.competitionFixturesForm.patchValue({
    //     has_super_over: "0",
    //     super_over_match_id: ''
    //   })
    // }
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
    // if (this.competitionFixturesForm.controls['is_neutral_venue'].value == "1") {
    //   params.is_neutral_venue = "1"
    // }
    // else {
    //   params.is_neutral_venue = "0"
    // }
   
    if (this.competitionFixturesForm.value.match_id){
      params.action_flag = 'update';
      console.log(params.match_id);
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
          if (err.status === 401 && err.error.message === "Expired") {
            this.apiService.RefreshToken();

          }

        })
    }
    // else {
    //   this.apiService.post(this.urlConstant.addfixture, params).subscribe((res) => {
     
    //   }, (err: any) => {
    //     err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
    //   });
    // }
    else {
      this.apiService.post(this.urlConstant.addfixture, params).subscribe((res) => {
        res.status_code === this.cricketKeyConstant.status_code.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }
}

editCardData(match_id:any){
  // const params: any = {
  //   action_flag: "edit",
  //   user_id: String(this.user_id),
  //   client_id: String(this.client_id),
  //   competition_id: this.CompetitionData?.competition_id != null ? String(this.CompetitionData.competition_id) : null,
  //   match_id: match_id != null ? String(match_id) : null, 
  // };
  // console.log('Edit Params:', params);
  // this.apiService.post(this.urlConstant.editfixture, params).subscribe(
  //   (res) => {
  //     const fixtureData = res.data[0]
  //       this.competitionFixturesForm.setValue({

  //         cloud_video_path: fixtureData.cloud_video_path,
  //         day_type: Number(fixtureData.day_type),
  //         digital_scorer: fixtureData.digital_scorer_id,
  //         external_ref: fixtureData.external_ref_id,
  //         ground: fixtureData.ground_id,
  //         // is_neutral_venue: Boolean(fixtureData.is_neutral_venue),
  //         jr_video: fixtureData.jr_video,
  //         manual_scorer: fixtureData.manual_scorer_id,
  //         match_end_date: fixtureData.match_end_date != null ? fixtureData.match_end_date.split('T')[0] : null,
  //         match_group: fixtureData.match_group_id,
  //         match_id: fixtureData.match_id,
  //         match_name: fixtureData.match_name,
  //         sequence_no: fixtureData.sequence_no,
  //         match_overs: fixtureData.match_overs,
  //         match_phase: fixtureData.match_phase_id,
  //         match_start_date: fixtureData.match_start_date.replace(' ', 'T'),
  //         referee: fixtureData.referee_id,
  //         has_super_over: fixtureData.has_super_over != null ? fixtureData.has_super_over.toString() : null,
  //         is_super_over: fixtureData.is_super_over != null ? fixtureData.is_super_over.toString() : null,
  //         super_over_match_id: fixtureData.super_over_match_id != null ? Number(fixtureData.super_over_match_id) : null,
  //         sr_video: fixtureData.sr_video,
  //         home_team: fixtureData.team_a_code,
  //         away_team: fixtureData.team_b_code,
  //         time_zone: fixtureData.time_zone_id,
  //         // umpire_1: fixtureData.umpire_1,
  //         // umpire_2: fixtureData.umpire_2,
  //         // umpire_3: fixtureData.umpire_3,
  //         // umpire_4: fixtureData.umpire_4,
  //          })


  //     }, (err: any) => {
  //       if (err.status === 401 && err.error.message === "Expired") {
  //         this.apiService.RefreshToken();

  //       } else {
  //         this.failedToast(err);
  //       }
  //     });

}
status(match_id: number, url: string) {
  const params: any = {
    user_id: this.user_id?.toString(),
    client_id: this.client_id?.toString(),
    match_id: match_id?.toString()
  };
  this.apiService.post(url, params).subscribe(
    (res: any) => {
      res.status_code === this.cricketKeyConstant.status_code.success && res.status ? (this.successToast(res), this.gridload()) : this.failedToast(res);
    },
    (err: any) => {
      error: (err: any) => {
        console.error('Error loading Match list:', err);
      }
    });
}
StatusConfirm(match_id: any) {
  console.log("hii");
  const params: any = {
    user_id: String(this.user_id),
    client_id: String(this.client_id),
    competition_id: this.CompetitionData?.competition_id != null ? String(this.CompetitionData.competition_id) : null,
    match_id: this.competitionFixturesForm.value.match_id != null ? String(this.competitionFixturesForm.value.match_id) : null,
    };
  this.apiService.post(this.urlConstant.deactivefixture, params).subscribe(
    (res: any) => {
      console.log("Deactivation success", res);
    }, 
    (err: any) => {
      if (err.status === 401 && err.error.message === "Expired") {
        this.apiService.RefreshToken();
      }
    }
  );
}

}