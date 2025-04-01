import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-all-component',
  templateUrl: './all-component.component.html',
  styleUrl: './all-component.component.css',
   imports: [
     SidebarComponent,
     HeaderComponent,
     CommonModule,
     RouterModule
   ],
})
export class AllComponentComponent {

  sidebarVisible = false;

  callsidebar(value: any) {
    this.sidebarVisible = value;
  }
}
