import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;
  private isLoggedIn: boolean = false;
  private id: string | null | undefined;

  constructor() { }

  // Method to save token received from login
  saveToken(token: string) {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    this.token = localStorage.getItem('token');
    return this.token;
  }

  SetRole(role: any) {
    localStorage.setItem('role', role);
  }

  get getRole(): string | null {
    return localStorage.getItem('role');
  }

  saveUserId(userid: string) {
    localStorage.setItem('userId', userid);
  }

  getUserId(): string | null {
    this.id = localStorage.getItem("userId");
    return this.id;
  }

  // Method to retrieve login status
  get getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    this.token = null;
    this.isLoggedIn = false;
  }
}
