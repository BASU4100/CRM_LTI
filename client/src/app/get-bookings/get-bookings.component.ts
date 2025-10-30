// import { DatePipe } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { HttpService } from '../../services/http.service';

// @Component({
//   selector: 'app-get-bookings',
//   templateUrl: './get-bookings.component.html',
//   styleUrls: ['./get-bookings.component.scss']
// })
// export class GetBookingsComponent implements OnInit {
//   // Variables as per requirements
//   itemForm!: FormGroup;
//   formModel: any = {};
//   showError: boolean = false;
//   errorMessage: any = '';
//   carList: any[] = [];
//   assignModel: any = {};
//   showMessage: boolean = false;
//   responseMessage: any = '';
//   updateId: any = null;
//   toBook: any = null;
//   idPaymentNow: any = null;
//   selectedBooking: any = null;
//   bookingList: any[] = [];

//   constructor(
//     private router: Router,
//     private httpService: HttpService,
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private datePipe: DatePipe
//   ) {
//     // Initialize form with fields expected by test cases
//     this.itemForm = this.fb.group({
//       amount: ['', [Validators.required, Validators.min(0)]],
//       paymentDate: ['', Validators.required],
//       paymentMethod: ['', Validators.required],
//       paymentStatus: ['', Validators.required],
//       status: [''] //, Validators.required
//     });
//   }

//   ngOnInit(): void {
//     // Check if user is logged in and has AGENT role
//     if (!this.authService.getLoginStatus || this.authService.getRole !== 'AGENT') {
//       this.router.navigate(['/login']);
//       return;
//     }
//     // Fetch bookings and cars on initialization
//     this.getBookingByAgent();
//     this.getAllCarList();
//   }

//   // Helper method to set error message with timeout
//   private setErrorMessage(message: string): void {
//     this.showError = true;
//     this.errorMessage = message;
//     setTimeout(() => {
//       this.showError = false;
//       this.errorMessage = '';
//     }, 5000); // 5000ms = 5 seconds
//   }

//   // Helper method to set success message with timeout
//   private setSuccessMessage(message: string): void {
//     this.showMessage = true;
//     this.responseMessage = message;
//     setTimeout(() => {
//       this.showMessage = false;
//       this.responseMessage = '';
//     }, 5000); // 5000ms = 5 seconds
//   }

//   // Fetch all bookings using getBookingByAgent
//   getBookingByAgent(): void {
//     this.httpService.getBookingByAgent().subscribe({
//       next: (response) => {
//         this.bookingList = response.map((booking: any) => ({
//           ...booking,
//           rentalStartDate: this.datePipe.transform(booking.rentalStartDate, 'mediumDate'),
//           rentalEndDate: this.datePipe.transform(booking.rentalEndDate, 'mediumDate')
//         }));
//         this.showError = false;
//       },
//       error: (error) => {
//         this.setErrorMessage('Failed to load bookings: ' + (error.error?.message || error.message));
//       }
//     });
//   }

//   // Fetch all cars (used for reference or display)
//   getAllCarList(): void {
//     this.httpService.getCars().subscribe({

//       next:(response) => {
//         this.carList = response;
//       },
//       error:(error) => {
//         this.setErrorMessage('Failed to load cars: ' + (error.error?.message || error.message));
//       }
//     })
      
//   }

//   // Update booking status
//   onSubmit(): void {
//     if (this.itemForm.valid && this.updateId) {
//       const status = this.itemForm.get('status')?.value;
//       // Note: HttpService's updateBookingStatus only sends 'booked', so we override status here
//       // To align with test, assume a custom status is allowed
//       this.httpService.updateBookingStatus(this.updateId).subscribe({

//         next:(response) => {
//           this.setSuccessMessage('Booking status updated successfully');
//           this.getBookingByAgent(); // Refresh booking list
//           this.itemForm.reset();
//           this.updateId = null;
//           this.selectedBooking = null;
//         },
//         error:(error) => {
//           this.setErrorMessage('Failed to update booking status: ' + (error.error?.message || error.message));
//         }
//        } );
//     } else {
//       this.setErrorMessage('Please fill in all required fields correctly');
//     }
//   }

  

//   // Set booking for status update or payment
//   bookNow(val: any): void {
//     this.updateId = val.id;
//     this.selectedBooking = val;
//     this.itemForm.patchValue({
//       status: val.status,
//       amount: val.totalAmount || '',
//       paymentDate: val.payment?.paymentDate ? this.datePipe.transform(val.payment.paymentDate, 'yyyy-MM-dd') : '',
//       paymentMethod: val.payment?.paymentMethod || '',
//       paymentStatus: val.payment?.paymentStatus || ''
//     });
//   }

//   // Initiate payment for a booking
//   payment(val: any): void {
//     this.idPaymentNow = val.id;
//     this.selectedBooking = val;
//     const paymentRequest = {
//       amount: this.itemForm.get('amount')?.value || val.totalAmount,
//       paymentDate: this.itemForm.get('paymentDate')?.value || new Date(),
//       paymentMethod: this.itemForm.get('paymentMethod')?.value || 'CREDIT_CARD',
//       paymentStatus: this.itemForm.get('paymentStatus')?.value || 'COMPLETED'
//     };
//     this.httpService.bookingPayment(paymentRequest, this.idPaymentNow).subscribe(
//       (response: any) => {
//         this.setSuccessMessage('Payment created successfully');
//         this.getBookingByAgent(); // Refresh booking list
//         this.idPaymentNow = null;
//         this.selectedBooking = null;
//         this.itemForm.reset();
//       },
//       (error: any) => {
//         this.setErrorMessage('Failed to create payment: ' + (error.error?.message || error.message));
//       }
//     );
//   }
// }
 
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
 
  /*** FORM ***/
  itemForm!: FormGroup;
 
  /*** UI FLAGS ***/
  showError = false;
  errorMessage = '';
  showMessage = false;
  responseMessage = '';
 
  /*** DATA ***/
  bookingList: any[] = [];
  carList: any[] = [];
 
  /*** SELECTED RECORD ***/
  selectedBooking: any = null;      // for UI only
  updateId: any = null;             // booking id for status update
  paymentId: any = null;            // booking id for payment
 
  constructor(
    private router: Router,
    private http: HttpService,
    private fb: FormBuilder,
    private auth: AuthService,
    private datePipe: DatePipe
  ) {
    this.createForm();
  }
 
  /* --------------------------------------------------------------- */
  /* -------------------------- LIFECYCLE -------------------------- */
  /* --------------------------------------------------------------- */
  ngOnInit(): void {
    // ---- role guard ------------------------------------------------
    if (!this.auth.getLoginStatus || this.auth.getRole !== 'AGENT') {
      this.router.navigate(['/dashboard']);
      return;
    }
 
    this.loadData();
  }
 
  private loadData(): void {
    this.getBookings();
    this.getCars();
  }
 
  /* --------------------------------------------------------------- */
  /* --------------------------- FORM ------------------------------ */
  /* --------------------------------------------------------------- */
  private createForm(): void {
    this.itemForm = this.fb.group({
      status: [''],
      amount: ['', [Validators.required, Validators.min(0)]],
      paymentDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentStatus: ['', Validators.required]
    });
  }
 
  /* --------------------------------------------------------------- */
  /* -------------------------- API CALLS -------------------------- */
  /* --------------------------------------------------------------- */
  private getBookings(): void {
    this.http.getBookingByAgent().subscribe({
      next: (data: any[]) => {
        this.bookingList = data.map(b => ({
          ...b,
          rentalStartDate: this.datePipe.transform(b.rentalStartDate, 'mediumDate'),
          rentalEndDate: this.datePipe.transform(b.rentalEndDate, 'mediumDate')
        }));
      },
      error: err => this.setError('Failed to load bookings: ' + (err.error?.message || err.message))
    });
  }
 
  private getCars(): void {
    this.http.getCars().subscribe({
      next: (data: any[]) => this.carList = data,
      error: err => this.setError('Failed to load cars: ' + (err.error?.message || err.message))
    });
  }
 
  /*** BOOK NOW (status → booked) ***/
  bookNow(booking: any): void {
    this.updateId = booking.id;
    this.selectedBooking = booking;
 
    // pre-fill form (status will be overwritten by API)
    this.itemForm.patchValue({
      status: booking.status,
      amount: booking.totalAmount || '',
      paymentDate: booking.payment?.paymentDate
        ? this.datePipe.transform(booking.payment.paymentDate, 'yyyy-MM-dd')
        : '',
      paymentMethod: booking.payment?.paymentMethod || '',
      paymentStatus: booking.payment?.paymentStatus || ''
    });
  }
 
  /*** PAYMENT ***/
  payment(booking: any): void {
    this.paymentId = booking.id;
    this.selectedBooking = booking;
 
    this.itemForm.patchValue({
      amount: booking.totalAmount || '',
      paymentDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      paymentMethod: 'CREDIT_CARD',
      paymentStatus: 'COMPLETED'
    });
  }
 
  /* --------------------------------------------------------------- */
  /* ----------------------- SUBMIT HANDLERS ----------------------- */
  /* --------------------------------------------------------------- */
 
  /*** UPDATE BOOKING STATUS (Book Now) ***/
  onStatusSubmit(): void {
    if (!this.updateId) return;
 
    this.http.updateBookingStatus(this.updateId).subscribe({
      next: () => {
        this.setSuccess('Booking status updated to **booked**');
        this.resetSelection();
        this.getBookings();
      },
      error: err => this.setError('Status update failed: ' + (err.error?.message || err.message))
    });
  }
 
  /*** CREATE PAYMENT ***/
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
        this.setSuccess('Payment recorded successfully');
        this.resetSelection();
        this.getBookings();
      },
      error: err => this.setError('Payment failed: ' + (err.error?.message || err.message))
    });
  }
 
  /* --------------------------------------------------------------- */
  /* -------------------------- HELPERS ---------------------------- */
  /* --------------------------------------------------------------- */
   resetSelection(): void {
    this.updateId = null;
    this.paymentId = null;
    this.selectedBooking = null;
    this.itemForm.reset();
  }
 
  private setError(msg: string): void {
    this.showError = true;
    this.errorMessage = msg;
    setTimeout(() => this.showError = false, 5000);
  }
 
  private setSuccess(msg: string): void {
    this.showMessage = true;
    this.responseMessage = msg;
    setTimeout(() => this.showMessage = false, 5000);
  }
}
 