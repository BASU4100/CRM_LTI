import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit, AfterViewInit {
  bookingList: any[] = [];
  roleName: string | null = null;
  paymentMethods: string[] = ['UPI', 'Card', 'NetBanking', 'Cash'];

  displayedColumns: string[] = ['username', 'paymentDate', 'paymentMethod', 'amount', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  filterForm!: FormGroup;

  showError: boolean = false;
  errorMessage: string = '';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      return;
    }

    this.roleName = this.authService.getRole;
    if (this.roleName !== 'ADMINISTRATOR') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.filterForm = this.fb.group({
      customerName: [''],
      paymentMethod: [''],
      status: ['']
    });

    this.getPaymentReport();

    this.resetFilters();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getPaymentReport(): void {
    this.httpService.paymentReport().subscribe({
      next: (res: any[]) => {
        this.bookingList = res;
        this.dataSource.data = res;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = "An error occurred.. Please try again later.";
        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 1500);
      }
    });
  }

  applyFilters(): void {
    const { customerName, paymentMethod, status } = this.filterForm.value;

    const filtered = this.bookingList.filter((payment: any) => {
      const nameMatch = customerName? (payment.booking?.user?.username || '').toLowerCase().includes(customerName.toLowerCase()) : true;

      const methodMatch = paymentMethod? payment.paymentMethod === paymentMethod : true;

      const statusMatch = status? (payment.booking?.paymentStatus || '').toLowerCase() === status.toLowerCase(): true;
      return nameMatch && methodMatch && statusMatch;
    });

    this.dataSource.data = filtered;
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.dataSource.data = this.bookingList;
  }

  closeError(): void {
    this.showError = false;
    this.errorMessage = '';
  }
}