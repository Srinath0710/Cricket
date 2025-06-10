import { Component, Input, OnInit, ViewEncapsulation, HostListener, Renderer2, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
imports:[CommonModule,RouterModule]
})
export class SidebarComponent implements OnInit {
  constructor(
    private apiService: ApiService, 
    private renderer: Renderer2, 
    private el: ElementRef,
    private router: Router,
    private themeService: ThemeService
  ) { }

  items = [];
  miniItems = [];
  @Input() sidebarVisible = false;
  showSidebarByDefault = true;
  sidebarVisible1 = false;
  menus: any = [];
  modules: any = [];
  submenus: any = [];
  user_id: any = localStorage.getItem('user_id');
  role_id: any = localStorage.getItem('role_id');
  activeRoute: string = '';
  clickedModule: any;
  is_sidbar_minimize = false;
  is_sidbar_maximize = false;
  envImagePath = environment.imagePath;
  menuList = [];
  imgUrl = localStorage.getItem('profile_img_url') != null && 
           localStorage.getItem('profile_img_url') != '' && 
           localStorage.getItem('profile_img_url') != 'null' 
           ? localStorage.getItem('profile_img_url') 
           : this.envImagePath + "/images/Logo.png";

  showSubmenuPopup = false;
  selectedParentMenu: any = null;
  popupPosition = { top: 0, left: 0 };
  isDarkMode = false;
  isMobile = false;
  themeSubscription: Subscription | null = null;

  ngOnInit() {
    this.checkIfMobile();
    var currentRoute = window.location.pathname;
    this.activeRoute = currentRoute;
    
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    this.getMenus();
    this.setupHoverBehavior();
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarVisible']) {
      console.log('Sidebar visibility changed:', this.sidebarVisible);
      this.showSidebarByDefault = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const submenuPopup = this.el.nativeElement.querySelector('.submenu-popup');
    const sidebar = this.el.nativeElement.querySelector('.modern-sidebar');

    if (this.showSubmenuPopup && submenuPopup && !submenuPopup.contains(target)) {
      this.closeSubmenuPopup();
    }

    if (this.isMobile && this.sidebarVisible && sidebar && !sidebar.contains(target)) {
      this.closeSidebar();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (this.showSubmenuPopup) {
        this.closeSubmenuPopup();
      }
    }
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  setupHoverBehavior() {
    if (!this.isMobile) {
      const sidebar = this.el.nativeElement.querySelector('.modern-sidebar');
      if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
          this.is_sidbar_maximize = true;
        });

        sidebar.addEventListener('mouseleave', () => {
          this.is_sidbar_maximize = false;
        });
      }
    }
  }

  toggleSidebar() {
    this.is_sidbar_maximize = !this.is_sidbar_maximize;
  }

  closeSidebar() {
    this.is_sidbar_maximize = false;
  }

  showSubmenuInPopup(parentMenu: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedParentMenu = parentMenu;
    this.showSubmenuPopup = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    this.popupPosition = {
      top: rect.top,
      left: this.sidebarVisible && this.is_sidbar_maximize ? 280 : 48
    };

    const popup = { width: 280, height: 400 };
    if (this.popupPosition.left + popup.width > window.innerWidth) {
      this.popupPosition.left = window.innerWidth - popup.width - 20;
    }
    if (this.popupPosition.top + popup.height > window.innerHeight) {
      this.popupPosition.top = window.innerHeight - popup.height - 20;
    }
  }

  closeSubmenuPopup() {
    this.showSubmenuPopup = false;
    this.selectedParentMenu = null;
  }

  navigateToSubmenu(submenu: any) {
    this.activeRoute = '/' + submenu.menu_link;
    this.setImage(submenu.menu_image);
    this.closeSubmenuPopup();
    if (this.isMobile) {
      this.closeSidebar();
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getAppIconClass(menuName: string): string {
    const name = menuName.toLowerCase();
    
    if (name.includes('home')) return 'home';
    if (name.includes('dashboard')) return 'dashboard';
    if (name.includes('user')) return 'users';
    if (name.includes('setting')) return 'settings';
    if (name.includes('report')) return 'reports';
    if (name.includes('analytic')) return 'analytics';
    if (name.includes('document')) return 'documents';
    if (name.includes('task')) return 'tasks';
    if (name.includes('calendar')) return 'calendar';
    if (name.includes('message')) return 'messages';
    
    return 'default';
  }

  getMenus() {
    const params: any = {};
    params.action_flag = 'get_menus_by_user_id';
    params.user_id = this.user_id.toString();
    params.role_id = this.role_id.toString();
    const url = 'Login/get_user_menus';
    
    this.apiService.userget(url, params).subscribe((res) => {
      let menusList = res.data.menu_list != undefined ? res.data.menu_list.filter((val: any) => val.parent_menu_id != 0) : [];
      this.menuList = res.data.menu_list != undefined ? res.data.menu_list.filter((val: any) => val.parent_menu_id != 0) : [];
      let modules = res.data.modules != undefined ? res.data.modules : [];
      let parent_menu_list = res.data.menu_list != undefined && res.data.menu_list ? res.data.menu_list.filter((val: any) => val.parent_menu_id == 0) : [];
      
      this.modules = [];
      var menu_list = modules;
      var parent_menu = parent_menu_list;
      
      console.log('Menu data loaded:', { menusList, modules, parent_menu_list });
      this.apiService.menuList = menusList;

      for (let i = 0; i < parent_menu_list.length; i++) {
        parent_menu[i]['sub_menu'] = [];
        parent_menu[i]['has_submenu'] = true;

        menusList.forEach((value: any, key: any) => {
          if (parent_menu_list[i].module_id == value.module_id && parent_menu_list[i].menu_id == value.parent_menu_id) {
            parent_menu[i]['sub_menu'].push(value);
          }
        });

        if (parent_menu[i]['sub_menu'].length === 0) {
          parent_menu[i]['has_submenu'] = false;
        }
      }

      for (let i = 0; i < modules.length; i++) {
        menu_list[i]['sub_parent'] = [];

        parent_menu.forEach((value: any, key: any) => {
          if (menu_list[i].module_id == value.module_id) {
            menu_list[i]['sub_parent'].push(value);
          }
        });

        menusList.forEach((value: any, key: any) => {
          if (menu_list[i].module_id == value.module_id && value.parent_menu_id == 0) {
            value['sub_menu'] = [];
            value['has_submenu'] = false;
            menu_list[i]['sub_parent'].push(value);
          }
        });
      }

      this.modules = menu_list;
      console.log('Processed modules:', this.modules);

    }, (err: any) => {
      console.error('Error loading menus:', err);
    });
  }

  setImage(images: any) {
    
  }

  toggleMenu() {
    this.sidebarVisible1 = !this.sidebarVisible1;
  }

  debugMenuData() {
    console.log('Debug - Current state:', {
      modules: this.modules,
      sidebarVisible: this.sidebarVisible,
      showSidebarByDefault: this.showSidebarByDefault,
      user_id: this.user_id,
      role_id: this.role_id
    });
    
    this.getMenus();
  }
}