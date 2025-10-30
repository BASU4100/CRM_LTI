import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {
  roleName: string | null = null;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.roleName = this.authService.getRole;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
