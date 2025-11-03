import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment.development';

//material
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core'

import { debounce, debounceTime } from 'rxjs';
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
  searchTerm: string = ''

  //sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  //filtering
  // filterForm!: FormGroup;
  searchControl = new FormControl('');
  filteredCars: any[] = [];

  //constructor
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
    }, {
      validators: [this.dateRangeValidator]
    });
  }

  //material properties
  displayedColumns: string[] = ['make', 'model', 'manufactureYear', 'registrationNumber', 'rentalRatePerDay', 'category', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public serverName = environment.apiUrl;

  private imageBaseUrl = `${this.serverName}/images/`;

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.applyFilters();
      });

    this.getCars();
  }
  // add filter
  applyFilters(): void {
    const term = this.searchControl.value?.trim().toLowerCase() || '';
    this.dataSource.filter = term;
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data.make.toLowerCase().includes(filter) ||
      data.model.toLowerCase().includes(filter) ||
      data.category?.name?.toLowerCase().includes(filter);
  }

  //get all available cars
   getCars(): void {
      this.httpService.getCars().subscribe({
        next: (data: any[]) => {
          // Map car data to include imageUrl
          this.carList = data.map(car => ({
            ...car,
            imageUrl: car.imageUrl ? `${this.imageBaseUrl}${car.imageUrl}` : 'assets/default-car.jpg'
          }));
          this.dataSource.data = this.carList;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.showError = false;
        },
        error: (err: any) => {
          this.showError = true;
          this.errorMessage = 'Failed to load available cars. Please try again.';
          console.error(err);
        }
      });
    }

  //Validate date 
  dateRangeValidator(formGroup: FormGroup) {
    const start = formGroup.get('rentalStartDate')?.value;
    const end = formGroup.get('rentalEndDate')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
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
        setTimeout(() => {
          this.showMessage = false;
          this.responseMessage = '';
          this.router.navigate(['/dashboard'])
        }, 1000);
      },
      error: (err: any) => {
        this.showError = true;
        this.errorMessage = err.error?.message || 'Booking failed. Please try again.';
        console.error(err);
        setTimeout(() => {
          this.showError = false;
          this.errorMessage = '';
        }, 1000);
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