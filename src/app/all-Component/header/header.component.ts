import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval, Subscription, merge, fromEvent, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [  
    CommonModule,
    ConfirmPopupModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['../sidebar/sidebar.component.css'],
  providers: [ConfirmationService, MessageService]

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
  showModal = false;
  isLoggingOut=false;
    // constructor(private confirmationService: ConfirmationService, private messageService: MessageService ,private apiService: ApiService, ) {}

    constructor(private confirmationService: ConfirmationService, private messageService: MessageService,private router: Router,private apiService: ApiService) {}

  ngOnInit(){
    // if(this.itealTimeoutEnable==1){
    //   this.setupInactivityTimeout();

    // }


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
    this.isLoggingOut=true;
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
    confirm(event: Event) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Save your current process?',
          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
          }
      });
  }
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = this.envImagePath + '/images/default-logo.png';
  }
  // toggleTheme() {
  //   console.log('Header toggle theme clicked, current mode:', this.isDarkMode);
  //   this.themeService.toggleTheme();
  // }

  showLogoutModal() {
    this.showModal = true;
    this.closeAllMenus();
  }
  closeAllMenus() {
    throw new Error('Method not implemented.');
  }

  hideLogoutModal(event?: Event) {
    if (event && event.target === event.currentTarget) {
      this.showModal = false;
    } else if (!event) {
      this.showModal = false;
    }
  }
  private clearStorageAndNavigate() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.clear();
    this.isLoggingOut = false;
    this.router.navigate(['login']);
  }
}
