import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, tap, throwError } from "rxjs";
import { environment } from '../environments/environment';


@Injectable({
    providedIn:'root'
})
​
export class UploadImgService {
​
    private domain= environment.apiUrl;
    headers = new HttpHeaders()
    .append('Authorization','Bearer' +  localStorage.getItem("token"));
    httpOptions = {
        headers: this.headers,
    };
    constructor(private http: HttpClient) {
    }
    private handleError(error: any) {
      return throwError(error);
    }
    post(type:any,params:any): Observable<any>{
      return    this.http.post(this.domain+type,params,this.httpOptions).pipe(tap(), catchError(this.handleError))
​
    }
    DownloadFile(filename:any,file:any) {
                const linkSource =   'data:application/octet-stream;,' +file;
                const downloadLink = document.createElement('a');
                downloadLink.href = file;
                downloadLink.target ='_blank' ;
                downloadLink.download = filename;
                downloadLink.click()
​
    }
}
