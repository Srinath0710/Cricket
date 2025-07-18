import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
import { ToastModule } from 'primeng/toast';
import { EventEmitter } from '@angular/core';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
import { Table, TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-comp-official',
  imports: [
    PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    Tooltip
  ], templateUrl: './comp-official.component.html',
  styleUrl: './comp-official.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
  standalone: true
})
export class CompOfficialComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: ManageDataItem = { competition_id: 0, name: '', match_type: '', gender: '', age_category: '', start_date: '', end_date: '', tour_type: '', trophy_name: '' };
  @Output() UpdateOfficial = new EventEmitter<void>();
  client_id: number = Number(localStorage.getItem('client_id'));

  user_id: number = Number(localStorage.getItem('user_id'));
  statusConstants = CricketKeyConstant.status_code;
  default_img = CricketKeyConstant.default_image_url.teamimage;
  targetOfficial: any[] = [];
  sourceOfficial: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
  sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';

  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService,
    private spinnerService: SpinnerService,
  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');
    this.gridLoad();
  }

  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compOfficialList, params).subscribe((res: any) => {
      console.log(res);
      const allItems = res.data.all_officials;
      const mappedIds = res.data.selected_officials.map((value: any) => value.official_id);
      this.sourceOfficial = allItems.filter((item: any) => !mappedIds.includes(item.official_id));
      this.targetOfficial = res.data.selected_officials
      this.spinnerService.raiseDataEmitterEvent('off');
    }, (err: any) => {

    })
  }
  updateOfficial() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.official_list = this.targetOfficial.map((p: any) => p.official_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compOfficialupdate, params).subscribe((res: any) => {
      this.UpdateOfficial.emit();
    }, (err: any) => {
      err.status_code === this.statusConstants.refresh && err.error.message === this.statusConstants.refresh_msg ? this.apiService.RefreshToken() : this.failedToast(err.error);
    });
  }


  moveToSource(official: any) {
    this.targetOfficial = this.targetOfficial.filter((t: any) => t.official_id !== official.official_id);
    this.sourceOfficial.push(official);
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  moveToTarget(official: any) {
    this.sourceOfficial = this.sourceOfficial.filter(t => t !== official);
    this.targetOfficial.push(official);
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
  successToast(data: any) {

  this.msgService.add({
    severity: 'success',
    summary: 'Success',
    detail: data.message,
    data: { image: 'assets/images/default-logo.png' },
  });
}
  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({
      data: { image: 'assets/images/default-logo.png' },
      severity: 'error',
      summary: 'Error',
      detail: data.message
    });
  }
}

