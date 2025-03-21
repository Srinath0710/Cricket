import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Renderer2, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
imports:[CommonModule,RouterModule]
})
export class SidebarComponent implements OnInit {
  constructor(private apiService: ApiService, private renderer: Renderer2, private el: ElementRef,private router:Router) { }
  items = [];
  miniItems = [];
  @Input() sidebarVisible = false;
  sidebarVisible1 = false;
  menus: any = [];
  modules: any = [];
  submenus: any = [];
  user_id:any = localStorage.getItem('user_id');
  role_id:any = localStorage.getItem('role_id');
  activeRoute: string = ''; clickedModule: any;
  is_sidbar_minimize = false;
  is_sidbar_maximize = false;
  envImagePath = environment.imagePath;
  menuList=[];
  imgUrl=localStorage.getItem('profile_img_url') !=null && localStorage.getItem('profile_img_url') !='' && localStorage.getItem('profile_img_url') !='null' ?  localStorage.getItem('profile_img_url'):this.envImagePath+"/images/Logo.png"
  ngOnInit() {



    var currentRoute = window.location.pathname
    this.activeRoute = currentRoute;
    // this.spinnerService.sidebaremitterr.subscribe((data) => {
    //   this.is_sidbar_minimize = data;
    //   if (data == false) {
    //     this.renderer.setStyle(this.el.nativeElement, 'content', 'none');
    //   } else {
    //     this.renderer.setStyle(this.el.nativeElement, 'content', 'unset');

    //   }
    // });

    this.getMenus();
  }
  toggleMenu() {


    this.sidebarVisible1 = !this.sidebarVisible1
  }
  getMenus() {




    const body = document.querySelector("body");
    // const darkLight = document.querySelector("#darkLight");
    const sidebar = document.querySelector(".sidebar");
    const newsidebar = document.querySelector(".layout-sidebar");
    const minisidebar = document.querySelector(".layout-menu-container");
    const submenuItems = document.querySelectorAll(".submenu_item");
    const sidebarOpen = document.querySelector("#sidebarOpen");
    const sidebarClose = document.querySelector(".collapse_sidebar");
    const sidebarExpand = document.querySelector(".expand_sidebar");
    sidebarOpen?.addEventListener("click", () => sidebar?.classList.toggle("close"));

    sidebarClose?.addEventListener("click", () => {
      sidebar?.classList.add("close", "hoverable");
    });
    sidebarClose?.addEventListener("click", () => {
      sidebar?.classList.add("close", "hoverable");
    });
    sidebarExpand?.addEventListener("click", () => {
      sidebar?.classList.remove("close", "hoverable");
    });

    sidebar?.addEventListener("mouseenter", () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.remove("close");
        this.is_sidbar_minimize = false;
      }
    });
    sidebar?.addEventListener("mouseleave", () => {
      if (sidebar.classList.contains("hoverable")) {
        sidebar.classList.add("close");
        this.is_sidbar_minimize = true;
      }
    });

    minisidebar?.addEventListener("mouseenter", () => {
      this.is_sidbar_maximize = true;
      newsidebar?.classList.remove("sidebar-width");
      // this.spinnerService.sidebarEmiter(this.is_sidbar_maximize);
      


    });
    newsidebar?.addEventListener("mouseleave", () => {
      this.is_sidbar_maximize = false;
      newsidebar.classList.add("sidebar-width");
      // this.spinnerService.sidebarEmiter(this.is_sidbar_maximize);

    });

    // darkLight.addEventListener("click", () => {
    //   body.classList.toggle("dark");
    //   if (body.classList.contains("dark")) {
    //     // document.setI;
    //     darkLight.classList.replace("bx-sun", "bx-moon");
    //   } else {
    //     darkLight.classList.replace("bx-moon", "bx-sun");
    //   }
    // });

    submenuItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        item.classList.toggle("show_submenu");
        submenuItems.forEach((item2, index2) => {
          if (index !== index2) {
            item2.classList.remove("show_submenu");
          }
        });
      });
    });

    if (window.innerWidth < 768) {
      sidebar?.classList.add("close");
    } else {
      sidebar?.classList.remove("close");
    }
    sidebar?.classList.add("close", "hoverable");


    const params: any = {};
    params.action_flag = 'get_menus_by_user_id';
    params.user_id = this.user_id.toString();
    params.role_id = this.role_id.toString();
    const url = 'Login/get_user_menus';
    this.apiService.userget(url, params).subscribe((res) => {
      let menusList = res.data.menu_list != undefined ?res.data.menu_list.filter((val:any)=>val.parent_menu_id!=0) : [];
      this.menuList=res.data.menu_list != undefined ?res.data.menu_list.filter((val:any)=>val.parent_menu_id!=0) : [];
        let modules=res.data.modules != undefined ? res.data.modules : [];
        let parent_menu_list=res.data.menu_list != undefined && res.data.menu_list?res.data.menu_list.filter((val:any)=>val.parent_menu_id==0) : [];
      // console.log(parent_menu_list)
        this.modules = [];
      var menu_list = modules
      var parent_menu = parent_menu_list
this.router.navigateByUrl('/'+menusList[0].menu_link)
     this.apiService.menuList=menusList;
      for (let i = 0; i < parent_menu_list.length; i++) {
        parent_menu[i]['sub_menu'] = []
        parent_menu[i]['has_submenu'] = true;

        menusList.forEach((value:any, key:any) => {
          if (parent_menu_list[i].module_id == value.module_id && parent_menu_list[i].menu_id == value.parent_menu_id) {
            parent_menu[i]['sub_menu'].push(value);

          }
        })


      }
      for (let i = 0; i < modules.length; i++) {
        menu_list[i]['sub_parent'] = []

        parent_menu.forEach((value:any, key:any) => {
          if (menu_list[i].module_id == value.module_id) {
            menu_list[i]['sub_parent'].push(value);
          }

        })
        menusList.forEach((value:any, key:any) => {
          if (menu_list[i].module_id == value.module_id && value.parent_menu_id == 0) {
            value['sub_menu'] = []
            value['has_submenu'] = false;

            menu_list[i]['sub_parent'].push(value);

          }
        })
      }

      this.modules = menu_list
         console.log(parent_menu_list)


    }, (err: any) => {

    });

   
  }
setImage(images:any){
  // this.spinnerService.urlImage(images);
}

}