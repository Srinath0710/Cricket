import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { Output, EventEmitter } from '@angular/core';
import { SpinnerService } from '../../../services/Spinner/spinner.service';
import { Table, TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { ToastService } from '../../../services/toast.service';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-comp-ground',
  imports: [PickListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TableModule,
    PaginatorModule,
    DialogModule,
    Tooltip
  ],
  templateUrl: './comp-ground.component.html',
  styleUrl: './comp-ground.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService },
    { provide: ToastService }
  ],
  standalone: true
})
export class CompGroundComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;
  @Input() CompetitionData: any = {};
  @Output() groundUpdated = new EventEmitter<void>();
  client_id: number = 0;
  movedToTarget: any[] = [];
  user_id: number = Number(localStorage.getItem('user_id'));
  movedToTargetIds = new Set<number>();
  statusConstants = CricketKeyConstant.status_code;
  default_img = CricketKeyConstant.default_image_url.grounds;
  targetGround: any[] = [];
  sourceGround: any[] = [];
  searchText: string = '';
  filteredTeams: any[] = [];
  sourceSearchKeyword: string = '';
  targetSearchKeyword: string = '';
  rows: number = 10;
  totalData: any = 0;
  pageData: number = 0;
  first: number = 0;
  groundData = []
  selectedGround: any = [];
  viewDialogVisible: boolean = false;


  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
    private spinnerService: SpinnerService,
    private toastService: ToastService,
  ) { }
  ngOnInit() {
    this.spinnerService.raiseDataEmitterEvent('on');

  }

  gridLoad() {
    this.spinnerService.raiseDataEmitterEvent('on');
    const params: any = {}
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.records = this.rows.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    params.search_text = this.sourceSearchKeyword.toString(),
      params.page_no = (Math.floor(this.first / this.rows) + 1).toString();
    this.apiService.post(this.urlConstant.compgroundList, params).subscribe((res: any) => {
      this.groundData = res.data.all_grounds ?? [];
      const allItems = res.data.all_grounds;
      const mappedIds = res.data.selected_grounds.map((value: any) => value.ground_id);
      this.sourceGround = allItems.filter((item: any) => !mappedIds.includes(item.ground_id));
      this.targetGround = res.data.selected_grounds
      this.totalData = res.data.all_grounds[0].total_records
      this.spinnerService.raiseDataEmitterEvent('off');

    }, (err: any) => {
      if (
        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
      ) {
        this.apiService.RefreshToken();
      }
      this.spinnerService.raiseDataEmitterEvent('off');
      this.failedToast(err.error);
    })
    this.spinnerService.raiseDataEmitterEvent('off');
  }
  updateGround() {
    const params: any = {}
    params.client_id = this.CompetitionData.client_id.toString();
    params.user_id = this.user_id.toString();
    params.ground_list = this.targetGround.map((p: any) => p.ground_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();

    this.apiService.post(this.urlConstant.compgroundupdate, params).subscribe((res: any) => {
      // this.groundUpdated.emit();
      this.gridLoad();
      this.successToast(res);
    }, (err: any) => {
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

  successToast(data: any) {
    this.toastService.successToast({ message: data.message })
  }
  /* Failed Toast */
  failedToast(data: any) {
    this.toastService.failedToast({ message: data.message })
  }



  moveToSource(ground: any) {
    this.targetGround = this.targetGround.filter((t: any) => t.ground_id !== ground.ground_id);
    this.sourceGround.push(ground);
  }

  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }

  moveToTarget(ground: any) {
    this.sourceGround = this.sourceGround.filter(t => t !== ground);
    this.targetGround.push(ground);
  }

  // filterGlobalSource($event: any, stringVal: string) {
  //   this.dt1?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  // }

  filterGlobalTarget($event: any, stringVal: string) {
    this.dt2?.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  filterGlobalSource() {
    if (this.sourceSearchKeyword.length >= 3 || this.sourceSearchKeyword.length === 0) {

      this.dt1?.filterGlobal(this.sourceSearchKeyword, 'contains');
      this.first = 0;
      this.gridLoad();
    }
  }
  clearSource(table: Table) {
    table.clear();
    this.sourceSearchKeyword = '';
    this.gridLoad();

  }

  clearTarget(table: Table) {
    table.clear();
    this.targetSearchKeyword = '';
    this.gridLoad();
  }

  onPageChange(event: any) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.gridLoad();
  }


  onViewGroundDetails(groundId: any) {
    const params = {
      ground_id: groundId.toString(),
      client_id: this.CompetitionData.client_id?.toString(),
      user_id: String(this.user_id)
    };


    this.apiService.post(this.urlConstant.viewGround, params).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.selectedGround = res.data.grounds;
          this.selectedGround.forEach((grounds: any) => {
            grounds.profile_img = grounds.profile_img + '?' + Math.random();
          });
          this.viewDialogVisible = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch ground details', err);
      }
    });
  }
  // onpageCall(){
  //   this.first=1;
  //   this.rows=10;
  // }
}

