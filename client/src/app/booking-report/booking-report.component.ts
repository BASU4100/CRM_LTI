
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  filterForm!: FormGroup;
  filteredBookings: any[] = [];
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
     this.filterForm = this.fb.group({
        customerName: [''],
        carModel: [''],
        status: ['']
      });
    this.getBookingReport();
    this.filterForm.valueChanges.subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const { customerName, carModel, status } = this.filterForm.value;
  
    this.filteredBookings = this.bookingList.filter(booking => {
      const matchesCustomer = customerName ? booking.user?.username?.toLowerCase().includes(customerName.toLowerCase()) : true;
      // const matchesModel = carModel ? booking.car?.model?.toLowerCase().includes(carModel.toLowerCase()) : true;
      const matchesModel = carModel ? booking.car?.model?.toLowerCase().includes(carModel.toLowerCase()) : true;
      const matchesStatus = status ? booking.status?.toLowerCase().includes(status.toLowerCase()) : true;
  
      return matchesCustomer && matchesModel && matchesStatus;
    });
  }

  getBookingReport(): void {
    this.httpService.getBookingReport().subscribe({
      next: (data: any[]) => {
        this.bookingList = data;
        this.filteredBookings = data;
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load booking report.';
        console.error(err);
      }
    });
  }

  // getBookingReport(): void {
  //   this.httpService.getBookingReport().subscribe({
  //     next: (res: any) => {
  //       this.bookingList = res;
  //       this.showMessage = true;
  //       this.responseMessage = 'Booking report loaded successfully';
  //       setTimeout(() => {
  //       this.showMessage = false;
  //       this.responseMessage = '';
  //       }, 1500);
  //     },
  //     error: () => {
  //       this.showError = true;
  //       this.errorMessage = 'Failed to load booking report';
  //     }
  //   });
  // }
}
