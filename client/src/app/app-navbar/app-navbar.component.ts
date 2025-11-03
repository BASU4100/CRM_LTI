import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {
  roleName: string | null = null;
  username:string | null='';
  userEmail:string | null='';
  showProfile:boolean=false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.roleName = this.authService.getRole;
    this.username=this.authService.getUsername();
    this.userEmail=this.authService.getEmail();
  }

  toggleProfile(){
    this.showProfile=!this.showProfile;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
