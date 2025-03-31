import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval, Subscription, merge, fromEvent, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  imports: [  
    CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['../sidebar/sidebar.component.css'],
})
export class HeaderComponent implements OnInit{
  sidebarVisible: boolean = false;
  userData:any={
      'profile_img_url':'',
      'header_color':'',
      'user_name':''
  };
  itealTimeoutEnable:any=localStorage.getItem('idle_timeout_enable');
  timeoutInSeconds = Number (localStorage.getItem('idle_timeout')!=null?localStorage.getItem('idle_timeout') :null);
   // 150 seconds (2.5 minutes)
  remainingTime: number = this.timeoutInSeconds;
  countdownInterval$ = interval(1000); // 1-second interval
  timerSubscription: Subscription | null = null; // Hold the subscription to cancel previous timers

 @Output() openSideBar: EventEmitter<any> = new EventEmitter();  
  sidebarOpen=false;
  envImagePath = environment.imagePath;

  constructor(private apiService: ApiService, private router: Router) {
  
  }
  ngOnInit(){
    if(this.itealTimeoutEnable==1){
      this.setupInactivityTimeout();

    }


      // this.spinnerService.sidebaremitterr.subscribe((data:any) => {
      //     this.sidebarOpen = data;
          
      //   });
      this.userData.profile_img_url=localStorage.getItem('profile_img_url') !=null && localStorage.getItem('profile_img_url') !='' && localStorage.getItem('profile_img_url') !='null' ?  localStorage.getItem('profile_img_url'):this.envImagePath+"/images/Logo sportalytics.png" ;
      this.userData.header_color=localStorage.getItem('header_color')
      this.userData.user_name=localStorage.getItem('user_name')
      const sidebar = document.querySelector(".sidebar");
      const sidebarClose = document.querySelector(".collapse_sidebar");
      const sidebarExpand = document.querySelector(".expand_sidebar");
      const sidebarOpen = document.querySelector("#sidebarOpen");
      const navbar = document.getElementById("navbar");
      sidebarOpen?.addEventListener("click", () => sidebar?.classList.toggle("close"));


      sidebarClose?.addEventListener("click", () => {
          sidebar?.classList.add("close", "hoverable");
          this.sidebarOpen=true
          // this.spinnerService.sidebarEmiter(this.sidebarOpen);
        });
        sidebarExpand?.addEventListener("click", () => {
          sidebar?.classList.remove("close", "hoverable");
          this.sidebarOpen=false
          // this.spinnerService.sidebarEmiter(this.sidebarOpen);

        });
        // navbar.style.backgroundColor = this.userData.header_color!=null && this.userData.header_color!=''? this.userData.header_color: 'rgba(121, 0, 0, 1)';
      }
  logOut() {
      const params: any = {};
      params.token = localStorage.getItem('token');

      this.apiService.post('Auth/log_out', params).subscribe((res: any) => {

          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.clear();
          this.router.navigate(['login']);
      },(err:any)=>{
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.clear();
          this.router.navigate(['login']);
      })
  }

  toggleMenu() {
    

          this.openSideBar.emit(this.sidebarVisible)
      
  }


  setupInactivityTimeout() {
      const userActivity$ = merge(
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'touchstart')
      );
  
      // When user activity is detected, start the countdown from 150 seconds
      userActivity$.pipe(
        tap(() => this.resetTimer())
      ).subscribe();
    }
  
    // Reset the timer and start counting down from 150
    resetTimer() {
      this.remainingTime = this.timeoutInSeconds;
  
      // If there is already an active timer, unsubscribe from it (to cancel it)
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
  
      // Start a new countdown from 150 seconds
      this.timerSubscription = this.countdownInterval$
        .pipe(
          tap(() => this.updateCountdown())
        )
        .subscribe();
    }
  
    // Update the countdown every second
    updateCountdown() {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.logOut();
      }
    }
 
}
