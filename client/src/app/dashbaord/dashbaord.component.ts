import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  userDetails: any;

  constructor(private router: Router, private authService: AuthService) {}
  
  // check protect component when logged out
  ngOnInit(): void {
    if(!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    this.userDetails = {
      username: this.authService.getUsername(),
      email: this.authService.getEmail()
    }
  }
}