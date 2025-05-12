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
  styleUrl: './comp-match.component.css'
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
  teamData: any = []
  viewMode: boolean = false;


  constructor(
    private formbuilder: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
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
      this.teamData = res.data ?? [];
      // this.totalData = 50;
      this.teamData.forEach((val: any) => {

      });
    }, (err: any) => {
      err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : (this.teamData = []);
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
        //  else {
        //   this.failedToast(err);
        // }
      })
  }

  hideDialog() {

    this.ShowForm = false
  }
    /* Failed Toast */
    failedToast(data: any) {
      this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
    }
  

    addCallBack() {
      this.resetForm();
      this.cancelForm();
      // this.successToast(res);
      this.gridload();
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
      competition_id: String(this.CompetitionData?.competition_id) || null,
      
      match_name: this.competitionFixturesForm.value.match_name ?? null,
      match_id: Number(this.competitionFixturesForm.value.match_id) || null,
      match_overs: String(this.competitionFixturesForm.value.match_overs) || null,
      time_zone_id: Number(this.competitionFixturesForm.value.time_zone_id) || null,
      day_type: this.competitionFixturesForm.value.day_type ?? null,
      
      team_1_code: this.competitionFixturesForm.value.team_1_code ?? null,
      team_2_code: this.competitionFixturesForm.value.team_2_code ?? null,
      ground_id: Number(this.competitionFixturesForm.value.ground_id) || null,
      match_group_id: Number(this.competitionFixturesForm.value.match_group_id) || null,
      match_phase_id: Number(this.competitionFixturesForm.value.match_phase_id) || null,
      
      umpire_1: Number(this.competitionFixturesForm.value.umpire_1) || null,
      umpire_2: Number(this.competitionFixturesForm.value.umpire_2) || null,
      umpire_3: Number(this.competitionFixturesForm.value.umpire_3) || null,
      umpire_4: Number(this.competitionFixturesForm.value.umpire_4) || null,
      referee_id: Number(this.competitionFixturesForm.value.referee_id) || null,
      
      sr_video: this.competitionFixturesForm.value.sr_video ?? null,
      jr_video: this.competitionFixturesForm.value.jr_video ?? null,
      manual_scorer_id: Number(this.competitionFixturesForm.value.manual_scorer_id) || null,
      digital_scorer_id: Number(this.competitionFixturesForm.value.digital_scorer_id) || null,
      local_video_path: this.competitionFixturesForm.value.local_video_path ?? null,
      
      sequence_no: String(this.competitionFixturesForm.value.sequence_no) || null,
      
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
              this.addCallBack();
              

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
    else {
      this.apiService.post(this.urlConstant.addfixture, params).subscribe((res) => {
     
      }, (err: any) => {
        err.status === this.cricketKeyConstant.status_code.refresh && err.error.message === this.cricketKeyConstant.status_code.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }
}

}
