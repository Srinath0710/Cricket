import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-comp-ground',
  imports: [PickListModule, CommonModule, FormsModule, ReactiveFormsModule,ToastModule],
  templateUrl: './comp-ground.component.html',
  styleUrl: './comp-ground.component.css',
  providers: [
    { provide: URLCONSTANT },
    { provide: CricketKeyConstant },
    { provide: MessageService },
    { provide: ConfirmationService }
  ],
  standalone: true
})
export class CompGroundComponent implements OnInit {
  @Input() CompetitionData: any;
  client_id: number = Number(localStorage.getItem('client_id'));
  default_img: any ='assets/images/default-player.png';
  sourceGround!: [];
  targetGround!:[];
  movedToTarget: any[] = [];
  user_id: number = Number(localStorage.getItem('user_id'));
  movedToTargetIds = new Set<number>();
  statusConstants= CricketKeyConstant.status_code;

  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private msgService: MessageService,
  ) { }
  ngOnInit() {
    this.gridLoad();
  }

  gridLoad() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compgroundList, params).subscribe((res: any) => {
      const allItems =res.data.all_grounds;
      const mappedIds = res.data.selected_grounds.map((value: any) => value.ground_id);
      this.sourceGround = allItems.filter((item: any) => !mappedIds.includes(item.ground_id));
      // this.targetGround = res.data.all_grounds
      this.targetGround = res.data.selected_grounds
    }, (err: any) => {
      if (
        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
      ) {
        this.apiService.RefreshToken();
      }

    })
  }
  updateGround() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.ground_list = this.targetGround.map((p: any) => p.ground_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();

    this.apiService.post(this.urlConstant.compgroundupdate, params).subscribe((res: any) => {
      this.gridLoad();
    }, (err: any) => {
      if (
        err.status_code === this.statusConstants.refresh &&
        err.error.message === this.statusConstants.refresh_msg
      ) {
        this.apiService.RefreshToken();
      }
    })
  }
  handleImageError(event: Event, fallbackUrl: string): void {
    const target = event.target as HTMLImageElement;
    target.src = fallbackUrl;
  }
  successToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'success', summary: 'Success', detail: data.message });

  }

  /* Failed Toast */
  failedToast(data: any) {
    this.msgService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: data.message });
  }


  onMoveToTarget(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = true; 
    });
  }
  
  onMoveToSource(event: any) {
    event.items.forEach((item: any) => {
      item.highlighted = false; 
    });
  }
}

