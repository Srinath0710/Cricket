import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { provideAnimations } from '@angular/platform-browser/animations';


const routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } 
];
bootstrapApplication(AppComponent, appConfig,)
  .catch((err) => console.error(err));
