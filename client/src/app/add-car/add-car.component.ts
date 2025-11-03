import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {
  itemForm: FormGroup;
  formModel: any;
  showError: boolean = false;
  errorMessage: any;
  categoryList: any[] = [];
  assignModel: any;
  carList: any[] = [];
  showMessage: boolean = false;
  responseMessage: any;
  updateId: any;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  selectedFile: File | null = null;
  imagePreview: string | null = null; // For image preview
  private imageBaseUrl = `${environment.apiUrl}/images/`;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.itemForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', [Validators.required, Validators.minLength(2)]],
      manufactureYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      registrationNumber: ['', Validators.required],
      status: ['AVAILABLE', Validators.required],
      rentalRatePerDay: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      category: ['', Validators.required],
      image: [null, Validators.required]
    });

    this.formModel = {
      make: 'Enter make',
      model: 'Enter Model',
      manufactureYear: 'Manufacture Year',
      registrationNumber: 'Registration Number',
      status: 'Choose Status',
      rentalRatePerDay: 'Enter Rate',
      category: 'Choose Category'
    };
  }

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }

    this.getAllCategoryList();
    this.getAllCarsList();

    this.updateId = this.route.snapshot.paramMap.get('id');
    if (this.updateId) {
      this.httpService.getAllCars().subscribe({
        next: (res: any[]) => {
          const car = res.find(c => c.id === +this.updateId);
          if (car) {
            this.itemForm.patchValue({
              make: car.make,
              model: car.model,
              manufactureYear: car.manufactureYear,
              registrationNumber: car.registrationNumber,
              status: car.status,
              rentalRatePerDay: car.rentalRatePerDay,
              category: car.category?.id
            });
            this.imagePreview = car.imagePath ? `${this.imageBaseUrl}${car.imagePath}` : null;
          }
        }
      });
    }
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        this.showError = true;
        this.errorMessage = 'Only image files are allowed (e.g., JPEG, PNG).';
        this.itemForm.get('image')?.setValue(null);
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }
      if (file.size > this.maxFileSize) {
        this.showError = true;
        this.errorMessage = 'File size exceeds 5MB limit.';
        this.itemForm.get('image')?.setValue(null);
        this.selectedFile = null;
        this.imagePreview = null;
        return;
      }
      this.selectedFile = file;
      this.itemForm.get('image')?.setValue(file);
      this.showError = false;

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Fetch all categories
  getAllCategoryList(): void {
    this.httpService.getAllCategories().subscribe({
      next: (res: any[]) => {
        this.categoryList = res;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to get categories';
      }
    });
  }

  // Fetch all cars
  getAllCarsList(): void {
    this.httpService.getAllCars().subscribe({
      next: (res: any[]) => {
        this.carList = res.map(car => ({
          ...car,
          imagePath: car.imageUrl ? `${this.imageBaseUrl}${car.imageUrl}` : 'assets/default-car.jpg'
        }));
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Failed to get cars';
      }
    });
  }

  // Edit car
  editCar(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue({
      make: val.make,
      model: val.model,
      manufactureYear: val.manufactureYear,
      registrationNumber: val.registrationNumber,
      status: val.status,
      rentalRatePerDay: val.rentalRatePerDay,
      category: val.category?.id
    });
    this.imagePreview = val.imageUrl? `${this.imageBaseUrl}${val.imageUrl}` : 'assets/default-car.jpg';
    this.selectedFile = null; // Reset selected file
  }

  // Handle year selection
  setYear(event: any): void {
    const selectedYear = new Date(event).getFullYear();
    this.itemForm.get('manufactureYear')?.setValue(selectedYear);
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }
  
    const carData = {
      make: this.itemForm.value.make,
      model: this.itemForm.value.model,
      manufactureYear: this.itemForm.value.manufactureYear,
      registrationNumber: this.itemForm.value.registrationNumber,
      status: this.itemForm.value.status,
      rentalRatePerDay: this.itemForm.value.rentalRatePerDay,
      category: { id: this.itemForm.value.category }
    };
  
    if (this.updateId) {
      this.httpService.updateCar(this.updateId, carData, this.selectedFile).subscribe({
        next: () => {
          this.showMessage = true;
          this.showError = false;
          this.responseMessage = 'Car Updated Successfully';
          this.getAllCategoryList();
          this.getAllCarsList();
          this.itemForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.updateId = null;
          this.itemForm.markAsUntouched();
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.showError = true;
          this.showMessage = false;
          this.errorMessage = error.error?.message || 'Failed to update car';
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      });
    } else {
      this.httpService.createCar(carData, this.selectedFile!).subscribe({
        next: () => {
          this.showMessage = true;
          this.showError = false;
          this.responseMessage = 'Car Saved Successfully';
          this.getAllCategoryList();
          this.getAllCarsList();
          this.itemForm.reset();
          this.selectedFile = null;
          this.imagePreview = null;
          this.itemForm.markAsUntouched();
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 50);
        },
        error: (error) => {
          this.showError = true;
          this.showMessage = false;
          this.errorMessage = error.error?.message || 'Failed to add car';
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      });
    }
  }


}

