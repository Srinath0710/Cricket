import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../environments/environment";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userget(url: string, params: any) {
    throw new Error('Method not implemented.');
  }
  private domain = environment.apiUrl;
  public apiurl: any;
  authorized = false;

  // Headers Setup
  headers = new HttpHeaders()
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");
  httpOptions = { headers: this.headers };
  menuList: any;

  constructor(
    private http: HttpClient, 
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: object // Inject platform ID
  ) {}

  // Function to check if running in a browser environment
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getIpCliente(): Observable<string> {
    this.authorized = true;
    return this.http.jsonp("https://ipinfo.io", "callback").pipe(
      map((response: any) => response)
    );
  }

  loginUser(user: any, url: any): Observable<any> {
    this.apiurl = this.domain + url;
    return this.http.post<any>(this.apiurl, user).pipe(tap(), catchError(this.handleError));
  }

  RefreshToken(): Observable<any> {
    if (!this.isBrowser()) return throwError("Cannot access localStorage in SSR");

    const token = { refresh_token: localStorage.getItem("refresh_token") };
    this.apiurl = this.domain + `Auth/refresh_token`;
    return this.http.post<any>(this.apiurl, token).pipe(tap(), catchError(this.handleError));
  }

  loggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem("token") : null;
  }

  GETAUTHORIZED(): boolean {
    const authorized = this.authorized;
    this.authorized = false;
    return authorized;
  }

  logoutUser(): void {
    if (this.isBrowser()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("role_id");
    }
    this.route.navigate(["/login"]);
  }

  noDomainGet(url: string): Observable<any> {
    this.authorized = true;
    return this.http.get<any>(url).pipe(
      tap((data) => console.log("Data received:", data)),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    return throwError(error);
  }
}
