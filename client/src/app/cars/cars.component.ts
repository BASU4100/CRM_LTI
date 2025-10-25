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
export class CarsComponent implements OnInit{

  itemForm! : FormGroup;
  formModel : any = {};
  showError : boolean = false;
  errorMessage : any;
  carList: any[]=[]
  assignModel : any;
  toBook : any;
  showMessage : any;
  responseMessage : any;
  updateId : any;

  constructor(private router : Router, private httpService : HttpService, private fb : FormBuilder, private authService : AuthService, private dataPipe : DatePipe){

  }
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      rentalStartDate : ['',[Validators.required]],
      rentalEndDate : ['',[Validators.required]]
    })
    this.getCars();
  }
  onSubmit():void{
    const carData = this.itemForm.value;
    this.httpService.post(`${environment.apiUrl}/api/agent/car`, carData).subscribe({
      next: ()=>{
        this.showMessage = true;
        this.responseMessage = 'Car added successfully';
        this.getCars();
      },
      error:() =>{
        this.showError = true;
        this.errorMessage = 'Error adding car';
      }
    });
  }
  getCars():void{
    this.httpService.get(`${environment.apiUrl}/api/agent/cars`).subscribe({
      next: (res: any)=> this.carList = res,
      error: () => this.errorMessage = 'Failed to load cars'
    });
  }

  book(val : any):void{
    this.toBook = val;
  }

}