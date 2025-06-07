import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { URLCONSTANT } from '../../services/url-constant';
import { CricketKeyConstant } from '../../services/cricket-key-constant';
import { EditCompitition, UpdateCompetition } from './competition.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CompTeamComponent } from './comp-team/comp-team.component';
import { CompOfficialComponent } from './comp-official/comp-official.component';
import { CompGroundComponent } from './comp-ground/comp-ground.component';
import { CompPlayerComponent } from './comp-player/comp-player.component';
import { CompMatchComponent } from './comp-match/comp-match.component';
import { Drawer } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';

interface Competition {
  competition_id: number;
  client_id: string;
  season_name: string;
  start_date: string;
  end_date: string;
  comp_date: string;
  competition_name: string;
  visual_name: string;
  trophy_name: string;
  format: string;
  tour_type: string;
  category: string;
  age_category: string;
  gender: string;
  record_status: string;
  profile_image: string;
  total_records: number;


  // UI properties
  name: string;
  match_type: string;
  status: string;
  imageUrl: string;
}
interface MetaDataItem {
  config_key: string;
  [key: string]: any;
}
interface season {
  season_id: number;
  season_name: string;
}
export interface ManageDataItem {
  competition_id: number, name: string, match_type: string, gender: string, age_category: string, start_date: string, end_date: string
}

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrl: './competition.component.css',
  imports: [
    DropdownModule,
    TagModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    PaginatorModule,
    ConfirmDialogModule,
    CompTeamComponent,
    CompOfficialComponent,
    CompGroundComponent,
    CompPlayerComponent,
    CompMatchComponent,
    Drawer,
    TooltipModule

  ],
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
  standalone: true
})
export class CompetitionComponent implements OnInit {
  public addCompetitionForm!: FormGroup<any>;
  user_id: number = Number(localStorage.getItem('user_id'));
  client_id: number = Number(localStorage.getItem('client_id'));
  searchKeyword: string = '';
  public ShowForm: any = false;
  position: string = 'right';
  backScreen: any;
  selectedcompitition: any = null;
  visibleDialog: boolean = false;
  compititionList: Competition[] = [];
  filteredCompititionList: Competition[] = [];
  showTabs: boolean = false;
  public activeTab: string = 'ground';
  totalRecords: number = 0;
  first: number = 1;
  rows: number = 6;
  isEditMode: boolean = false;
  submitted: boolean = false;
  viewMode: boolean = false;
  seasonList: season[] = [];
  regionsData: [] = [];
  metaDataList: MetaDataItem[] = [];
  tourtypeList: MetaDataItem[] = [];
  tourformatList: MetaDataItem[] = [];
  filterTourformatList: MetaDataItem[] = [];
  genderList: MetaDataItem[] = [];
  ageGroupList: MetaDataItem[] = [];
  tourlevelList: MetaDataItem[] = [];
  teamdropList: MetaDataItem[] = [];
  clientData: any[] = [];

  conditionConstants= CricketKeyConstant.condition_key;
  statusConstants= CricketKeyConstant.status_code;

  // Filter properties
  showFilters: boolean = false;
  filterStatus: string = '';
  filterMatchType: string = '';
  filterCategory: string = '';
  manageData:ManageDataItem  = { competition_id: 0,name:'',match_type:'',gender:'',age_category:'',start_date:'',end_date:'' };
  competitionData: Competition = {
    competition_id: 0,
    client_id: '',
    season_name: '',
    start_date: '',
    end_date: '',
    comp_date: '',
    competition_name: '',
    visual_name: '',
    trophy_name: '',
    format: '',
    tour_type: '',
    category: '',
    age_category: '',
    gender: '',
    record_status: '',
    profile_image: '',
    total_records: 0,
    name: '',
    match_type: '',
    status: '',
    imageUrl: ''
  };
  isClientShow: boolean=false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private messageService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.initForm();
    this.Clientdropdown();
    this.getGlobalData();
    this.loadCompetitions();
  }

  initForm() {
    this.addCompetitionForm = this.fb.group({
      competition_id: [],
      season_id: [],
      competition_type_id: ['', Validators.required],
      competition_category_id: ['1', Validators.required],
      age_category_id: ['', Validators.required],
      competition_level: ['', Validators.required],
      gender_id: ['', Validators.required],
      competition_format_id: ['', Validators.required],
      competition_name: ['', Validators.required],
      visual_name: ['', Validators.required],
      trophy_name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      video_path: ['', Validators.required],
      overs_per_innings: [''],
      overs_per_bowler: [''],
      points_abandoned: [''],
      points_draw: [''],
      points_win: [''],
      points_lead: [''],
      points_tie: [''],
      calculation: [''],
      competition_image: [null],
      distrib_id: [null],
      is_practice: ['',Validators.required]
    });
  }

  showDialog() {
    this.isEditMode = false;
    this.addCompetitionForm.patchValue({ status: 'Active' });
    this.ShowForm = true;
    this.resetForm()
  }

  loadCompetitions() {
    const params: any = {
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
      page_no: this.first.toString(),
      records: this.rows.toString()
    };


    if (this.filterStatus) {
      params.status = this.filterStatus;
    }
    if (this.filterMatchType) {
      params.match_type = this.filterMatchType;
    }
    if (this.filterCategory) {
      params.category = this.filterCategory;
    }

    this.apiService.post(this.urlConstant.getCompetitionList, params).subscribe(
      (res) => {
        if (res.data && res.data.competitions) {
          this.compititionList = res.data.competitions.map((comp: any) => {

            return {
              ...comp,
              competition_id: comp.competition_id,
              name: comp.competition_name,
              start_date: comp.start_date,
              end_date: comp.end_date,
              match_type: comp.format,
              status: comp.record_status,
              imageUrl: comp.profile_image || 'assets/images/default-competition.png'
            };
          });

          this.filteredCompititionList = [...this.compititionList];

          if (this.compititionList.length > 0 && this.compititionList[0].total_records) {
            this.totalRecords = this.compititionList[0].total_records;
          }
        }
      },
      (err) => {
        if (err.status_code === this.statusConstants.refresh &&
          err.error.message === this.statusConstants.refresh_msg) {
          this.apiService.RefreshToken();
        } else {
          this.compititionList = [];
          this.filteredCompititionList = [];
          this.totalRecords = 0;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load competitions'
          });
        }
      }
    );
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {

    this.first = 1;
    this.loadCompetitions();
    this.showFilters = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Filters Applied',
      detail: 'Competition list has been filtered'
    });
  }

  editCompitition(comp: any) {
    this.isEditMode = true;
    const params: any = {};
    params.user_id = this.user_id?.toString();
    params.client_id = this.client_id?.toString();
    params.competition_id = comp.competition_id?.toString();
    this.apiService.post(this.urlConstant.editcompetition, params).subscribe((res) => {
      if (res.status_code == this.statusConstants.success && res.status)  {
        const editRecord: EditCompitition = res.data.competitions[0] ?? {};
        if (editRecord != null) {
          this.addCompetitionForm.setValue({
            competition_id: editRecord.competition_id,
            season_id: editRecord.season_id,
            competition_name: editRecord.competition_name,
            visual_name: editRecord.visual_name,
            trophy_name: editRecord.trophy_name,
            competition_type_id: editRecord.competition_type_id,
            competition_category_id: editRecord.competition_category_id,
            gender_id: editRecord.gender_id,
            age_category_id: editRecord.age_category_id,
            competition_level: editRecord.competition_level,
            competition_format_id: editRecord.competition_format_id,
            start_date: editRecord.start_date!=null ?editRecord.start_date.split('T')[0] :null,
            end_date: editRecord.end_date!=null ?editRecord.end_date.split('T')[0] :null,
            video_path: editRecord.video_path,
            overs_per_innings: editRecord.overs_per_innings,
            overs_per_bowler: editRecord.overs_per_bowler,
            points_abandoned: editRecord.points_abandoned,
            points_draw: editRecord.points_draw,
            points_win: editRecord.points_win,
            points_lead: editRecord.points_lead,
            points_tie: editRecord.points_tie,
            calculation: editRecord.calculation,
            competition_image: null,
            distrib_id: null,
            is_practice: editRecord.is_practice,
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

  viewShowDialog() {
    this.visibleDialog = true;
    this.backScreen = "overlay1";
  }

  viewCompitition(competition: any) {
    this.selectedcompitition = competition;
    this.visibleDialog = true;
  }

  toggleStatus(competition: any) {
    const newStatus = competition.status === 'Active' ? 'InActive' : 'Active';


    const params = {
      user_id: this.user_id.toString(),
      client_id: this.client_id.toString(),
      competition_id: competition.competition_id.toString(),
      status: newStatus
    };
    competition.status = newStatus;
    this.messageService.add({
      severity: 'success',
      summary: 'Status Updated',
      detail: `Competition status changed to ${newStatus}`
    });
  }

  changeTabs(tabName: string, competition: Competition) {
    this.activeTab = tabName;
    this.competitionData = competition;
    this.showTabs = true;
    this.manageData = {
      competition_id: competition.competition_id,
      name: competition.competition_name,
      age_category:competition.age_category,
      match_type:competition.match_type,
      gender:competition.gender,
      start_date:competition.start_date,
      end_date:competition.end_date
    }

  }

  onPageChange(event: any) {

    this.first = Math.floor(event.first / event.rows) + 1;
    this.rows = event.rows;
    this.loadCompetitions();
  }

  cancelForm() {
    this.ShowForm = false;
  }
  resetForm() {
    this.addCompetitionForm.reset();
    this.submitted = false;
  }
  successToast(data: any) {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }
  addCallBack(res: any) {
    this.resetForm();
    this.cancelForm();
    this.successToast(res);
    this.loadCompetitions();
  }


  onAddCompetition() {
    this.isEditMode = false;
    this.submitted = true;
    if (this.addCompetitionForm.invalid) {
      this.addCompetitionForm.markAllAsTouched();
      return
    }
    const params: UpdateCompetition = {
      user_id: String(this.user_id),
      client_id: String(this.client_id),
      season_id: String(this.addCompetitionForm.value.season_id),
      competition_type_id: String(this.addCompetitionForm.value.competition_type_id),
      competition_name: this.addCompetitionForm.value.competition_name,
      visual_name: this.addCompetitionForm.value.visual_name,
      trophy_name: this.addCompetitionForm.value.trophy_name,
      competition_category_id: String(this.addCompetitionForm.value.competition_category_id ?? '1'),
      gender_id: String(this.addCompetitionForm.value.gender_id),
      age_category_id: String(this.addCompetitionForm.value.age_category_id),
      competition_level: String(this.addCompetitionForm.value.competition_level),
      competition_format_id: String(this.addCompetitionForm.value.competition_format_id),
      start_date: this.addCompetitionForm.value.start_date,
      end_date: this.addCompetitionForm.value.end_date,
      is_practice: String(this.addCompetitionForm.value.is_practice),
      video_path: this.addCompetitionForm.value.video_path,
      overs_per_innings: String(this.addCompetitionForm.value.overs_per_innings),
      overs_per_bowler: String(this.addCompetitionForm.value.overs_per_bowler),
      points_abandoned: String(this.addCompetitionForm.value.points_abandoned),
      points_draw: String(this.addCompetitionForm.value.points_draw),
      points_win: String(this.addCompetitionForm.value.points_win),
      points_lead: String(this.addCompetitionForm.value.points_lead),
      points_tie: String(this.addCompetitionForm.value.points_tie),
      calculation: String(this.addCompetitionForm.value.calculation),
      competition_id: String(this.addCompetitionForm.value.competition_id),
      action_flag: 'create',
    };
    if (this.addCompetitionForm.value.competition_id) {
      params.action_flag = 'update';
      this.apiService.post(this.urlConstant.updateCompetition, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    } else {
      this.apiService.post(this.urlConstant.createCompetition, params).subscribe((res) => {
        res.status_code === this.statusConstants.success && res.status ? this.addCallBack(res) : this.failedToast(res);
      }, (err: any) => {
        err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err);
      });
    }

  }
  getGlobalData() {

    const params: any = {};
    params.action_flag = 'drop_down';
    params.user_id = this.user_id.toString();
    params.client_id = this.client_id.toString();
    this.apiService.post(this.urlConstant.dropdownlookups, params).subscribe((res: any) => {
      this.seasonList = res.data["seasons"] != undefined ? res.data["seasons"] : [];
      this.metaDataList = res.data["metadata"] != undefined ? res.data["metadata"] : [];
      this.tourtypeList = this.metaDataList.filter(temp => temp.config_key === 'comp_type');
      this.filterTourformatList = this.metaDataList.filter(temp => temp.config_key === 'team_format');
      this.genderList = this.metaDataList.filter(temp => temp.config_key === 'gender');
      this.ageGroupList = this.metaDataList.filter(temp => temp.config_key === 'age_category');
      this.tourlevelList = this.metaDataList.filter(temp => temp.config_key === 'comp_level');


    }, (err: any) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message  ){
      
        this.apiService.RefreshToken();
        this.failedToast(err.error)

      }

    })
  }
  goBack(): void {
    this.showTabs = false;
    this.loadCompetitions();
  }
  Clientdropdown() {
    const params: any = {
      user_id: this.user_id?.toString()
    };
    this.apiService.post(this.urlConstant.groundUserClient, params).subscribe((res) => {
      this.clientData = res.data ?? [];
      this.client_id= this.clientData[0].client_id;
      this.isClientShow=this.clientData.length>1?true:false;
      this.loadCompetitions();

    }, (err) => {
      if (err.status_code === this.statusConstants.refresh && err.error.message  ){
        this.failedToast(err.error)
        this.apiService.RefreshToken();

      }
    });
  }
  StatusConfirm(competition_id: number, actionObject: { key: string; label: string }) {
    console.log("hii")
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionObject.label} this Competition?`, 
      header: 'Confirmation',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        const url: string = this.conditionConstants.active_status.key === actionObject.key
          ? this.urlConstant.activecompetition
          : this.urlConstant.deactivecompetition;
          console.log(url)
        this.status(competition_id, url);
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    });
  }
  status(competition_id: number, url: string) {
    console.log(competition_id)
    const params: any = {
      user_id: this.user_id?.toString(),
      client_id: this.client_id?.toString(),
      competition_id: competition_id?.toString()
    };
  
    this.apiService.post(url, params).subscribe(
      (res: any) => {
        console.log(res)

        res.status_code === this.statusConstants.success && res.status
          ? (this.successToast(res), this.loadCompetitions())
          : this.failedToast(res);
      },
      (err: any) => {
        console.log(err)

        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
          ? this.apiService.RefreshToken()
          : this.failedToast(err);
      }
    );
  }
  
}