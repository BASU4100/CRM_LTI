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
  assignModel : any = {};
  toBook : any= null;
  showMessage : boolean = false;
  responseMessage : any = ''; 
  updateId : any = null;

  //constructor
  constructor(private router : Router, private httpService : HttpService, private fb : FormBuilder, private authService : AuthService, private dataPipe : DatePipe){

  }
  //on page load
  ngOnInit(): void {
    if(!this.authService.getLoginStatus){
      this.router.navigate(['/login']);
      return;
    }
    this.initForm();
    this.getCars();
  }
  //on form load
  initForm(): void{
    const now = new Date();
    const minStart = this.dataPipe.transform(now, 'yyyy-MM-ddTHH:mm') || '';

    this.itemForm = this.fb.group({
      rentalStartDate : ['',[Validators.required]],
      rentalEndDate : ['',[Validators.required]]
    },{
      Validators: this.dateRangeValidator
    });
  }

  //Custom validator to ensure end date > start date
  dateRangeValidator(g : FormGroup){
    const start = g.get('rentalStartDate')?.value;
    const end = g.get('rentalEndDate')?.value;
    return start && end && new Date(start) < new Date(end)? null : { invalidRange : true};
  }

  //On submitting the form 
  onSubmit():void{
    if(this.itemForm.invalid){
      return;
    }
    this.showError = false;
    this.showMessage= false;

    const userId = this.authService.getUserId();
    const carId = this.assignModel.id;

    const bookingData = {
      rentalStartDate : this.itemForm.value.rentalStartDate,
      rentalEndDate : this.itemForm.value.rentalEndDate
    };
    this.httpService.bookACar(bookingData, userId, carId).subscribe({
      next:(response : any)=>{
        this.showMessage = true;
        this.responseMessage = 'Car booked successfully!';
        this.toBook = null;
        this.getCars();
      },
      error:(err)=>{
        this.showError = true;
        this.errorMessage = err.error?.message || 'Booking failed. Please try again.';
      }
    });
  }
  
  //get all the available cars
  getCars():void{
    this.httpService.getCars().subscribe({
      next:(data : any[])=>{
        this.carList = data.filter(car => car.status === 'available');
      },
      error: (err)=>{
        this.showError = true;
        this.errorMessage = err.error?.message || 'Failed to load cars.';
      }
    });
  }


  book(car : any):void{
    this.assignModel = {...car};
    this.toBook = car.id;
    this.updateId = null;

    //Reset form
    this.itemForm.reset();
    const now = new Date();
    const future = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day

    this.itemForm.patchValue({
      rentalStartDate : this.dataPipe.transform(now, 'yyyy-MM-ddTHH:mm'),
      rentalEndDate: this.dataPipe.transform(future, 'yyyy-MM-ddTHH:mm')
    });
  }
}