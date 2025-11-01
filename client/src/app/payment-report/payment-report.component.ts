import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {
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
  filteredList: any = [];
  selectedStatus: string = '';
  roleName: string | null = null;

  customerNameFilter: string = '';
  paymentMethodFilter: string = '';
  paymentMethods: string[] = ['All', 'UPI', 'Card', 'NetBanking', 'Cash'];

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

  //method that gets the payment report and is called immediately as the page loads.
  getPaymentReport() : void{
    // this.bookingList=[];
    this.httpService.paymentReport().subscribe({
      next : (res : any[]) => {
        this.bookingList = res;
        this.filteredList = res;
      }, 
      // error - scenario
      error : () => {

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
    if (!this.customerNameFilter && !this.paymentMethodFilter && !this.selectedStatus) {
      this.filteredList = this.bookingList;
      return;
    }

    this.filteredList = this.bookingList.filter((payment: any) => {
      const nameMatch = !this.customerNameFilter ||
        (payment.customerName || '').toLowerCase().includes(this.customerNameFilter.toLowerCase());

      const methodMatch = !this.paymentMethodFilter ||
        this.paymentMethodFilter === 'All' ||
        (payment.paymentMethod || '') === this.paymentMethodFilter;

      const statusMatch = !this.selectedStatus ||
        (payment.paymentStatus || '').toLowerCase() === this.selectedStatus.toLowerCase();

      return nameMatch && methodMatch && statusMatch;
    });
  }

  filterByStatus(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.customerNameFilter = '';
    this.paymentMethodFilter = '';
    this.selectedStatus = '';
    this.filteredList = this.bookingList;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}