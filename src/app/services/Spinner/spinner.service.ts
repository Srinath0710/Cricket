import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0;
  private spinner$ = new BehaviorSubject<string>('');

  constructor() { }

  getSpinnerObserver(): Observable<string> {
    return this.spinner$.asObservable();
  }

  requestStarted() {
    if (++this.count === 1) {
      this.spinner$.next('start');
    }
  }

  requestEnded() {
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next('stop');
    }
  }

  resetSpinner() {
    this.count = 0;
    this.spinner$.next('stop');
  }
  dataemitterr= new EventEmitter<any>();
  sidebaremitterr= new EventEmitter<any>();
  activeUrlImage=new EventEmitter<any>();
     raiseDataEmitterEvent(data:any){
         this.dataemitterr.next(data);
     }
 
sidebarEmiter(data:boolean){
  this.sidebaremitterr.next(data);
}
urlImage(data:any){
  this.activeUrlImage.next(data);
}
singleFilter(data:any,filterKey:string,filtervalue:any){
  return data.filter((val:any)=>val[filterKey]==filtervalue)

}
}