import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();
  private id: string | null | undefined;

  constructor() { }

  // Method to save token received from login
  saveToken(token: string) {
    this._isLoggedIn.next(true);
    localStorage.setItem('token', token);
  }
  
  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }
  
  // Method to save role received from login
  SetRole(role: any) {
    localStorage.setItem('role', role);
  }
  
  get getRole(): string | null {
    return localStorage.getItem('role');
  }
  
  // Method to save userId received from login
  saveUserId(userid: string) {
    localStorage.setItem('userId', userid);
  }

  getUserId(): string | null {
    this.id = localStorage.getItem("userId");
    return this.id;
  }

  // Method to retrieve login status
  get getLoginStatus(): boolean {
    let loginStatus!: boolean;
    this.isLoggedIn$.subscribe(isLoggedIn => loginStatus = isLoggedIn);
    return loginStatus;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.token = null;
    this._isLoggedIn.next(false);
  }

  // Method to save username received from login
  saveUsername(username: string) {
    localStorage.setItem("username", username);
  }

  getUsername(): string | null {
    return localStorage.getItem("username");
  }

  // Method to save email received from login
  saveEmail(email: string) {
    localStorage.setItem("email", email);
  }

  getEmail(): string | null {
    return localStorage.getItem("email");
  }
}
