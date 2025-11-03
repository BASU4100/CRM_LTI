
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.scss']
})
export class BookingReportComponent implements OnInit, AfterViewInit {
  formModel: any;
  showError: boolean = false;
  errorMessage: any;
  carList: any[] = [];
  assignModel: any;
  bookingList: any[] = [];
  displayedColumns: string[] = ['carMake', 'carModel', 'customerName', 'rentalStartDate', 'rentalEndDate', 'status', 'paymentStatus'];
  toBook: any;
  showMessage: any;
  responseMessage: any;
  updateId: any;
  filterForm!: FormGroup;
  filteredBookings: any[] = [];
  dataSource = new MatTableDataSource<any>(this.filteredBookings);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    else if (this.authService.getRole !== 'ADMINISTRATOR') {
      this.router.navigate(['/dashboard']);
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters(): void {
    const { customerName, carModel, status } = this.filterForm.value;

    this.filteredBookings = this.bookingList.filter(booking => {
      const matchesCustomer = customerName ? booking.user?.username?.toLowerCase().includes(customerName.toLowerCase()) : true;
      const matchesModel = carModel ? booking.car?.model?.toLowerCase().includes(carModel.toLowerCase()) : true;
      const matchesStatus = status ? booking.status?.toLowerCase().includes(status.toLowerCase()) : true;

      return matchesCustomer && matchesModel && matchesStatus;
    });

    this.dataSource.data = this.filteredBookings;
  }

  getBookingReport(): void {
    this.httpService.getBookingReport().subscribe({
      next: (data: any[]) => {
        this.bookingList = data;
        this.filteredBookings = data;
        this.dataSource.data = data;
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load booking report.';
        console.error(err);
      }
    });
  }
}
