


import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

export interface Booking {
  id: number;
  car?: { make: string; model: string };
  user?: { username: string };
  rentalStartDate: string;
  rentalEndDate: string;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID';
  totalAmount: number;
}

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent implements OnInit, AfterViewInit {

  itemForm!: FormGroup;
  dataSource = new MatTableDataSource<Booking>([]);

  displayedColumns: string[] = [
    'car', 'user', 'start', 'end',
    'bookingStatus', 'paymentStatus', 'total', 'actions'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';

  confirmId: number | null = null;
  paymentId: number | null = null;
  selectedBooking!: Booking;

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (!this.auth.getLoginStatus || this.auth.getRole !== 'AGENT') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.getBookings();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private createForm(): void {
    this.itemForm = this.fb.group({
      amount: [{ value: '', disabled: true }, Validators.required],
      paymentDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: [{ value: 'PAID', disabled: true }, Validators.required]
    });
  }

  private getBookings(): void {
    this.http.getBookingByAgent().subscribe({
      next: (data: any[]) => {
        const mapped: Booking[] = data.map(b => {
          const rawStatus = b.status || 'PENDING';
          const displayStatus = rawStatus.toUpperCase() === 'BOOKED'
            ? 'CONFIRMED'
            : rawStatus.toUpperCase();

          return {
            id: b.id,
            car: b.car,
            user: b.user,
            rentalStartDate: this.formatDate(b.rentalStartDate),
            rentalEndDate: this.formatDate(b.rentalEndDate),
            bookingStatus: displayStatus as Booking['bookingStatus'],
            paymentStatus: (b.payment?.paymentStatus || b.paymentStatus || 'UNPAID')
              .toUpperCase() as Booking['paymentStatus'],
            totalAmount: b.totalAmount || 0
          };
        });

        // REVERSE: Show newest first
        this.dataSource.data = mapped.reverse();
      },
      error: err => this.setError('Failed to load: ' + (err.error?.message || err.message))
    });
  }

  private formatDate(date: any): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  bookNow(booking: Booking): void {
    this.confirmId = booking.id;
    this.paymentId = null;
    this.selectedBooking = booking;
    this.itemForm.reset();
  }

  payment(booking: Booking): void {
    this.paymentId = booking.id;
    this.confirmId = null;
    this.selectedBooking = booking;

    this.itemForm.patchValue({
      amount: booking.totalAmount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      paymentStatus: 'PAID'
    });
  }

  onStatusSubmit(): void {
    if (!this.confirmId) return;

    this.http.updateBookingStatus(this.confirmId).subscribe({
      next: () => {
        this.setSuccess('Booking updated to <strong>BOOKED</strong>');
        this.getBookings();
        this.reset();
      },
      error: err => this.setError('Update failed: ' + (err.error?.message || err.message))
    });
  }

  onPaymentSubmit(): void {
    if (this.itemForm.invalid || !this.paymentId) return;

    const payload = {
      amount: this.selectedBooking.totalAmount,
      paymentDate: this.itemForm.get('paymentDate')?.value,
      paymentMethod: this.itemForm.get('paymentMethod')?.value,
      paymentStatus: 'PAID'
    };

    this.http.bookingPayment(payload, this.paymentId).subscribe({
      next: () => {
        this.setSuccess('Payment recorded - status <strong>PAID</strong>');
        this.getBookings();
        this.reset();
      },
      error: err => this.setError('Payment failed: ' + (err.error?.message || err.message))
    });
  }

  reset(): void {
    this.confirmId = null;
    this.paymentId = null;
    this.selectedBooking = null!;
    this.itemForm.reset();
  }

  private setError(msg: string): void {
    this.errorMessage = msg;
    this.showError = true;
    setTimeout(() => this.showError = false, 5000);
  }

  private setSuccess(msg: string): void {
    this.responseMessage = msg;
    this.showMessage = true;
    setTimeout(() => this.showMessage = false, 5000);
  }

  deleteBooking(id: number): void { 
    this.http.deleteBookingByAgent(id).subscribe({
      next: () => {
      
        this.setSuccess('Booking deleted successfully.');
        this.getBookings(); // Refresh the list
        this.dataSource.data = this.dataSource.data.filter(b=>b.id !==id)
        this.getBookings()
        this.reset()
      },
      error: err => {
        this.setError('Delete failed: ' + (err.error?.message || err.message))
        this.ngOnInit();
      }
    
    });
  }
}
