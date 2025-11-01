
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent implements OnInit {

  itemForm!: FormGroup;
  showError = false;   errorMessage = '';
  showMessage = false; responseMessage = '';

  bookingList: any[] = [];
  selectedBooking: any = null;
  updateId: any = null;      // for Book Now
  paymentId: any = null;     // for Payment

  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService,
    private datePipe: DatePipe
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

  private createForm(): void {
    this.itemForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      paymentDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: ['', Validators.required]
    });
  }

 
 private getBookings(): void {
   this.http.getBookingByAgent().subscribe({
     next: (data: any[]) => {
       this.bookingList = data.map(b => {
         const rawStatus = b.status || 'PENDING';
         const displayStatus = rawStatus.toUpperCase() === 'BOOKED' ? 'CONFIRMED' : rawStatus.toUpperCase();
 
         return {
           ...b,
           rentalStartDate: this.datePipe.transform(b.rentalStartDate, 'mediumDate'),
           rentalEndDate:   this.datePipe.transform(b.rentalEndDate,   'mediumDate'),
           bookingStatus: displayStatus,
           paymentStatus: (b.payment?.paymentStatus || b.paymentStatus || 'UNPAID').toUpperCase(),
           totalAmount: b.totalAmount || 0
         };
       });
     },
     error: err => this.setError('Failed to load: ' + (err.error?.message || err.message))
   });
 }
 


  // BOOK NOW – show inline form
  bookNow(booking: any): void {
    this.updateId = booking.id;
    this.paymentId = null;
    this.selectedBooking = booking;
    this.itemForm.reset();
  }

  // PAY – show inline form with pre-filled values
  payment(booking: any): void {
    this.paymentId = booking.id;
    this.updateId = null;
    this.selectedBooking = booking;

    this.itemForm.patchValue({
      amount: booking.totalAmount,
      paymentDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      paymentMethod: '',
      paymentStatus: 'PAID'
    });
  }

  // UPDATE BOOKING STATUS
  onStatusSubmit(): void {
    if (!this.updateId) return;

    this.http.updateBookingStatus(this.updateId).subscribe({
      next: () => {
        this.setSuccess('Booking updated to **BOOKED**');
        this.getBookings();
        this.reset();
      },
      error: err => this.setError('Update failed: ' + (err.error?.message || err.message))
    });
  }

  // RECORD PAYMENT
  onPaymentSubmit(): void {
    if (this.itemForm.invalid || !this.paymentId) return;

    const payload = {
      amount: this.itemForm.get('amount')?.value,
      paymentDate: this.itemForm.get('paymentDate')?.value,
      paymentMethod: this.itemForm.get('paymentMethod')?.value,
      paymentStatus: this.itemForm.get('paymentStatus')?.value
    };

    this.http.bookingPayment(payload, this.paymentId).subscribe({
      next: () => {
        this.setSuccess('Payment recorded – status **PAID**');
        this.getBookings();
        this.reset();
      },
      error: err => this.setError('Payment failed: ' + (err.error?.message || err.message))
    });
  }

  reset(): void {
    this.updateId = null;
    this.paymentId = null;
    this.selectedBooking = null;
    this.itemForm.reset();
  }

  private setError(msg: string): void {
    this.showError = true; this.errorMessage = msg;
    setTimeout(() => this.showError = false, 5000);
  }

  private setSuccess(msg: string): void {
    this.showMessage = true; this.responseMessage = msg;
    setTimeout(() => this.showMessage = false, 5000);
  }
}
