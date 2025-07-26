import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    protected domain = environment.apiUrl;
    private apiUrl: any;
    private menuId: any = '0';
    public menuList = [];

    constructor(
        protected http: HttpClient,
        private authService: AuthService,
        private router: Router
    ) {}

    private getHeaders(): HttpHeaders {
        if (typeof window === 'undefined') return new HttpHeaders(); // Prevent SSR error
        this.currentUrl();

        return new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + (localStorage.getItem('token') || ''))
            .set('RoleID', localStorage.getItem('role_id') || '')
            .set('MenuID', localStorage.getItem('menu_id') || '');
    }

    private handleError(error: any) {
        return throwError(error);
    }

    userget(url: any, params: any): Observable<any> {
        this.apiUrl = this.domain + url;
        return this.http.post<any>(this.apiUrl, params, { headers: this.getHeaders() })
            .pipe(tap(), catchError(this.handleError));
    }

    get(url: string): Observable<any> {
        this.apiUrl = this.domain + url;
        return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() })
            .pipe(tap(), catchError(this.handleError));
    }

    post(url: any, params: any): Observable<any> {
        this.apiUrl = this.domain + url;
        return this.http.post<any>(this.apiUrl, params, { 
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || ''),
                'RoleID': localStorage.getItem('role_id') || '',
                'MenuID': localStorage.getItem('menu_id') || ''

            })
         })
            .pipe(tap(), catchError(this.handleError));
    }

    RefreshToken() {
        // const params: any = { token: localStorage.getItem('token') };
        // this.post('Auth/log_out', params).subscribe(
        //     () => this.clearSession(),
        //     () => this.clearSession()
        // );
    }

    private clearSession() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.clear();
        this.router.navigate(['login']);
    }

    currentUrl() {
        localStorage.removeItem('menu_id');
        const activeUrlSegments = this.router.url.substring(1);
        const activeMenu: any = this.menuList.find((val: any) => val.menu_link === activeUrlSegments);
        const menuId = activeMenu?.menu_id ?? 0;
        const Modify = activeMenu?.modify ?? 0;

        this.menuId = menuId;
        localStorage.setItem('menu_id', menuId.toString());
        localStorage.setItem('modify', Modify.toString());
    }

    feedSummary(user_id: any, client_id: any, competition_id: any) {
        const params = {
            'user_id': user_id.toString(),
            'client_id': client_id.toString(),
            'competition_id': competition_id.toString()
        };
        this.post('Feed/generate_competition_schedule', params).subscribe();
    }
}
