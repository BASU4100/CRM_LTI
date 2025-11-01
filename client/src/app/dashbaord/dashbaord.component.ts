import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit {
  userDetails: any;
  //customer bookings
  bookingList: any[]=[];
  showError : boolean = false;
  errorMessage : any = '';
  showMessage: any = false;
  responseMessage: any = '';

  constructor(private router: Router, private authService: AuthService, private httpService : HttpService) {}
  
  // check protect component when logged out
  ngOnInit(): void {
    if(!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    this.userDetails = {
      username: this.authService.getUsername(),
      email: this.authService.getEmail()
    }
    this.getCustomerBookings();
  }

  getCustomerBookings() {
      this.httpService.getCustomerBookings().subscribe(
          (response: any) => {
              console.log('Bookings response:', response); // Debug log
              this.bookingList = response;
              this.showMessage = true;
              setTimeout(() => {
                this.showMessage = false;
              }, 1500);
              this.responseMessage = 'Bookings fetched successfully';
          },
          (error: any) => {
              this.showError = true;
              this.errorMessage = 'Failed to fetch bookings';
              setTimeout(() => {
                this.showError = false;
              }, 15000);
              console.error('Error fetching bookings:', error); // Debug log
          }
      );
  }
  
  
}