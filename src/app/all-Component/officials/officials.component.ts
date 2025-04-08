import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-officials',
  templateUrl: './officials.component.html',
  styleUrl: './officials.component.css',
  imports: [DrawerModule,
     ButtonModule]
})
export class OfficialsComponent {
  visible1: boolean = false;
}
