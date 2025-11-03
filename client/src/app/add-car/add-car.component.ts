import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})

export class AddCarComponent implements OnInit {
  itemForm!: FormGroup
  formModel: any
  showError: boolean = false
  errorMessage: any
  categoryList: any[] = []
  assignModel: any
  carList: any[] = []
  showMessage: any = false
  responseMessage: any
  updateId: any

  constructor(private router: Router, private httpService: HttpService, private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login'])
    }

    this.itemForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', [Validators.required, Validators.minLength(2)]],
      manufactureYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]], // Validators.pattern('^19[0-9]{2}|20[0-2][0-9]$')
      registrationNumber: ['', [Validators.required]],
      status: ['', Validators.required],
      rentalRatePerDay: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      category: ['', Validators.required]
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

    this.getAllCategoryList()
    this.itemForm.reset();

    this.updateId = this.route.snapshot.paramMap.get('id')
    if (this.updateId) {
      this.getAllCarsList();
      setTimeout(() => {
        const car = this.carList.find(c => c.id === +this.updateId);
        this.itemForm.patchValue({
          ...car,
          category: {
            name: car.category.name
          }
        });
      }, 100)
    }
  }

  // fetching all cars list from database
  getAllCategoryList(): void {
    this.httpService.getAllCategories().subscribe({
      next: (res: any[]) => {
        this.categoryList = res
        // console.log(this.carList);
      },
      error: () => {
        this.showError = true
        this.errorMessage = 'Failed to get cars'
      }
    })
  }

  //edits the car with existing patch values
  editCar(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue({
      ...val,
      category: val.category.id
    });
  }

  getAllCarsList(): void {
    this.httpService.getAllCars().subscribe({
      next: (res: any[]) => {
        this.carList = res
        console.log(this.carList);
      },
      error: () => {
        this.showError = true
        this.errorMessage = 'Failed to get cars'
      }
    })
  }

  setYear(event: Date): void {
    const selectedYear = event.getFullYear();
    this.itemForm.get('manufactureYear')?.setValue(new Date(selectedYear, 0, 1));
  }

  onSubmit(): void {
    const carData = {
      ...this.itemForm.value,
      category: { id: this.itemForm.value.category }
    }

    if (this.updateId) {
      this.httpService.updateCar(this.updateId, carData).subscribe({
        next: () => {
          this.showMessage = true
          this.errorMessage = false
          this.responseMessage = 'Car Updated Successfully'
          this.getAllCategoryList()
          this.getAllCarsList()
          this.itemForm.reset()
          this.itemForm.untouched
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.showError = true
          this.showMessage = false
          this.responseMessage = error.error.message;
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      })
    }
    else {
      this.httpService.createCar(carData).subscribe({
        next: () => {
          this.showMessage = true
          this.errorMessage = false
          this.responseMessage = 'Car Saved Successfully'
          this.getAllCategoryList()
          this.getAllCarsList()
          this.itemForm.reset()
          this.itemForm.untouched
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.showError = true
          this.showMessage = false
          this.responseMessage = "";
          this.errorMessage = "Failed to add Car"
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      })
    }
  }


}

