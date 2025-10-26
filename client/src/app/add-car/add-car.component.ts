import { animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})

export class AddCarComponent implements OnInit {
  itemForm!:FormGroup
  formModel:any
  showError:boolean = false
  errorMessage:any
  categortList:any[] = []
  assignModel:any
  carList:any[] = []
  showMessage:any = false
  responseMessage:any
  updateId:any

  // form structure and placeholder value
  constructor(private router:Router, private httpService: HttpService, private fb:FormBuilder, private authService:AuthService) {
    this.itemForm = this.fb.group({
      make:['', Validators.required],
      model:['', Validators.required],
      manufactureYear:['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]], // Validators.pattern('^19[0-9]{2}|20[0-2][0-9]$')
      registrationNumber:['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{6}$')]],
      status: ['', Validators.required]
    });
    this.formModel = {
      make: 'Make',
      model: 'Model',
      manufactureYear: 'Manufacture Year',
      registrationNumber: 'Registration Number',
      status: 'Choose'
    };
  }

  // loading all cars on component loading
  ngOnInit():void {
    this.getAllCarList()
  }

  // fetching all cars list from database
  getAllCarList():void {
    this.httpService.getAllCarList().subscribe({
      next:(res:any[]) => {
        this.carList = res
      },
      error: () => {
        this.showError = true
        this.errorMessage = 'Failed to get cars'
      }
    })
  }

  // maybe on click of edit button routes to carsComponent which seems to be the edit form for cars editable by agent
  editCar(val:any):void{
    
  }

  onSubmit():void
  {
    const carData = this.itemForm.value
    this.httpService.addCar(carData).subscribe({
      next:() => {
        this.showMessage = true
        this.errorMessage = false
        this.responseMessage = 'Car Saved Successfully'
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
}