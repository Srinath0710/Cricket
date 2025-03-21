import {Component, OnInit, ChangeDetectorRef, Injectable} from '@angular/core';
import { SpinnerService } from './spinner.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner-component.html',
  styleUrls: ['./spinner-component.scss']
})
@Injectable({
    providedIn: 'root',
})
export class SpinnerComponent implements OnInit {
  datas: any;

  envImagePath = environment.imagePath;


  constructor(private spinnerService: SpinnerService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.spinnerService.dataemitterr.subscribe((data)=>{
        this.datas=data;
    });
    }
  }

