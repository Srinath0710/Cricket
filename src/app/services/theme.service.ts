import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('sidebar-theme');
    const isDark = savedTheme === 'dark';
    this.setTheme(isDark, false);
  }

  setTheme(isDarkMode: boolean, saveToStorage: boolean = true) {
    this.isDarkModeSubject.next(isDarkMode);
    
    if (saveToStorage) {
      localStorage.setItem('sidebar-theme', isDarkMode ? 'dark' : 'light');
    }
    
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }

  toggleTheme() {
    const currentTheme = this.isDarkModeSubject.value;
    this.setTheme(!currentTheme);
  }

  getCurrentTheme(): boolean {
    return this.isDarkModeSubject.value;
  }
}