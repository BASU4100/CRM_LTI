
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit {
  formModel: any;
  showError: boolean = false;
  errorMessage: any;
  carList: any[] = [];
  assignModel: any;
  bookingList: any[] = [];
  toBook: any;
  showMessage: any;
  responseMessage: any;
  updateId: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if(!this.authService.getLoginStatus){
      this.router.navigate(['/login']);
    }
    this.getBookingReport();
  }

  getBookingReport(): void {
    this.httpService.getBookingByAgent().subscribe({
      next: (res: any) => {
        this.bookingList = res;
        this.showMessage = true;
        this.responseMessage = 'Booking report loaded successfully';
        setTimeout(() => {
        this.showMessage = false;
        this.responseMessage = '';
        }, 1500);
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to load booking report';
      }
    });
  }
}
