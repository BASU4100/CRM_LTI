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

export class AddCarComponent implements OnInit //todo: complete missing code.
{
  itemForm!:FormGroup
  formModel:any
  showError:boolean = false
  categortList:any[] = []
  assignModel:any
  carList:any[] = []
  showMessage:any = false
  responseMessage:any
  updateId:any

  constructor(private router:Router,private httpService:HttpService,private fb:FormBuilder,private authService:AuthService)
  {
    this.itemForm = fb.group({
      make:['',Validators.required],
      model:['',[Validators.required,Validators.minLength(2)]],
      manufactureYear:['',[Validators.required,Validators.pattern('^19[0-9]{2}|20[0-2][0-9]$'),Validators.min(1900),Validators.max(new Date().getFullYear())]],
      registrationNumber:['',[Validators.required,Validators.pattern('^[A-Z]{2}-[0-9]{2}-[A-Z]{1,2}-[0-9]{1,4}$')]],
      status: ['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllCarList()
  }

  getAllCarList():void
  {
    this.httpService.get(`${environment.apiUrl}/api/agent/cars`).subscribe({
      next:(res:any) => {
        this.carList = res
      },
      error: () => {
        this.showError = true
        this.responseMessage = 'Failed to cars'
      }
    })
  }

  editCar(val:any):void{
    this.updateId = val.id
    this.itemForm.patchValue(val)
  }

  onSubmit():void
  {
    const carData = this.itemForm.value
    this.httpService.post(`${environment.apiUrl}/api/agent/cars`,carData).subscribe({
      next:() => {
        this.showMessage = true
        this.responseMessage = 'Car added successfully'
        this.getAllCarList()
      },
      error: () => {
        this.showError = true
        this.responseMessage = 'Error adding car'
      }
    })
  }
  
  

}