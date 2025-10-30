import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  // Variables as per requirement
  itemForm: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';
  carList: any[] = [];
  assignModel: any = {};
  toBook: any = null;
  showMessage: any = false;
  responseMessage: any = '';
  updateId: any = null;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    // Initialize Reactive Form
    this.itemForm = this.fb.group({
      rentalStartDate: ['', Validators.required],
      rentalEndDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if(!this.authService.getLoginStatus)
    {
      this.router.navigate(['/login'])
    }
    this.getCars();
  }

  // Fetch all available cars
  getCars(): void {
    this.httpService.getCars().subscribe({
      next: (data: any[]) => {
        this.carList = data;
        this.showError = false;
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = 'Failed to load available cars. Please try again.';
        console.error(err);
      }
    });
  }

  // Open booking modal/form for a specific car
  book(val: any): void {
    this.toBook = { ...val }; // Copy car details
    this.updateId = null;
    this.itemForm.reset();
    this.showMessage = false;
    this.itemForm.reset();
    this.formModel = {};

    // Open modal or show form (assumes Bootstrap modal with ID #bookCarModal)
    const modal = document.getElementById('bookCarModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Submit booking
  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId(); // Assume AuthService stores user ID after login
    if (!userId) {
      this.showError = true;
      this.errorMessage = 'User not logged in.';
      return;
    }

    const bookingData = {
      rentalStartDate: this.datePipe.transform(this.itemForm.value.rentalStartDate, 'yyyy-MM-dd HH:mm:ss'),
      rentalEndDate: this.datePipe.transform(this.itemForm.value.rentalEndDate, 'yyyy-MM-dd HH:mm:ss')
    };

    this.httpService.bookACar(bookingData, userId, this.toBook.id).subscribe({
      next: (response: any) => {
        this.showMessage = true;
        this.responseMessage = 'Car booked successfully!';
        this.itemForm.reset();
        this.closeModal();
        this.getCars(); // Refresh available cars
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = err.error?.message || 'Booking failed. Please try again.';
        console.error(err);
      }
    });
  }

cancelBooking() {
  this.toBook = null;
  this.itemForm.reset();
}
  // Close modal helper
  closeModal(): void {
    const modal = document.getElementById('bookCarModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }
}