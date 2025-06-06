import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';
import { CricketKeyConstant } from '../../../services/cricket-key-constant';
import { URLCONSTANT } from '../../../services/url-constant';
import { PickListModule } from 'primeng/picklist';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageDataItem } from '../competition.component';
@Component({
  selector: 'app-comp-official',
  imports: [PickListModule, CommonModule, FormsModule, ReactiveFormsModule,
  ],  templateUrl: './comp-official.component.html',
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
  @Input() CompetitionData: ManageDataItem={ competition_id: 0,name:'',match_type:'',gender:'',age_category:'',start_date:'',end_date:'' };
  client_id: number = Number(localStorage.getItem('client_id'));
  sourceOfficial!: [];
  targetOfficial!:[];
  user_id: number = Number(localStorage.getItem('user_id'));
  constructor(
    private apiService: ApiService,
    private urlConstant: URLCONSTANT,
    private messageService: MessageService,
    private cricketKeyConstant: CricketKeyConstant,
    private confirmationService: ConfirmationService
  ) { }
  ngOnInit() {
    this.gridLoad();
  }

  gridLoad() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
    this.apiService.post(this.urlConstant.compOfficialList, params).subscribe((res: any) => {
      console.log(res);
      const allItems =res.data.all_officials;
      const mappedIds = res.data.selected_officials.map((value: any) => value.official_id);
      this.sourceOfficial = allItems.filter((item: any) => !mappedIds.includes(item.official_id));
      this.targetOfficial = res.data.selected_officials
    console.log(this.sourceOfficial,this.targetOfficial,mappedIds)
    }, (err: any) => {

    })
  }
  updateOfficial() {
    const params: any = {}
    params.client_id = this.client_id.toString();
    params.user_id = this.user_id.toString();
    params.official_list = this.targetOfficial.map((p: any) => p.official_id).join(',').toString();
    params.competition_id = this.CompetitionData.competition_id.toString();
console.log("tar",this.targetOfficial);

    this.apiService.post(this.urlConstant.compOfficialupdate, params).subscribe((res: any) => {
      this.gridLoad();
    }, (err: any) => {

    })
  }
}

