import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private inject: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authservice = this.inject.get(AuthService);

    // List of URLs to exclude
    const isExcluded =authservice.GETAUTHORIZED() ;

    // Check if the request URL is in the excluded list
    if (isExcluded) {
      return next.handle(req);
    }

    // Add authorization header if not excluded
    const token = authservice.getToken();
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}

