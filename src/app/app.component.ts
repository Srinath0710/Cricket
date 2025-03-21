import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: 
  [ButtonModule, 
    InputTextModule,
    RouterOutlet
  ], 

})
export class AppComponent {
  title = 'cricket';
}
