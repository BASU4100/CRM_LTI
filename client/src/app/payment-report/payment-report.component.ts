import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  carList: any = [];
  assignModel: any = {};
  showMessage: any;
  responseMessage: any;
  updateId: any;
  toBook: any = {};
  bookingList: any = [];
  roleName: string | null = null;

  customerNameFilter: string = '';
  paymentMethodFilter: string = '';
  selectedStatus: string = '';
  paymentMethods: string[] = ['All', 'UPI', 'Card', 'NetBanking', 'Cash'];

  displayedColumns: string[] = ['customerName', 'paymentDate', 'paymentMethod', 'amount', 'status'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    } else {
      this.roleName = this.authService.getRole;
      if (this.roleName !== 'ADMINISTRATOR') {
        this.router.navigate(['/dashboard']);
      } else {
        this.getPaymentReport();
      }
    }
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
    const filtered = this.bookingList.filter((payment: any) => {
      const nameMatch = !this.customerNameFilter ||
        (payment.customerName || '').toLowerCase().includes(this.customerNameFilter.toLowerCase());

      const methodMatch = !this.paymentMethodFilter ||
        this.paymentMethodFilter === 'All' ||
        (payment.paymentMethod || '') === this.paymentMethodFilter;

      const statusMatch = !this.selectedStatus ||
        (payment.paymentStatus || '').toLowerCase() === this.selectedStatus.toLowerCase();

      return nameMatch && methodMatch && statusMatch;
    });

    this.dataSource.data = filtered;
  }

  resetFilters(): void {
    this.customerNameFilter = '';
    this.paymentMethodFilter = '';
    this.selectedStatus = '';
    this.dataSource.data = this.bookingList;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  closeError(): void {
    this.showError = false;
    this.errorMessage = '';
  }
}
``