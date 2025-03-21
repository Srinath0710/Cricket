import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private service: AuthService,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: object // Inject PLATFORM_ID
  ) {}

  canActivate(): boolean {
    // Ensure localStorage is accessed only in the browser
    if (isPlatformBrowser(this.platformId) && this.service.loggedIn()) {
      return true;
    } else {
      this.route.navigate(['login']);
      return false;
    }
  }
}
