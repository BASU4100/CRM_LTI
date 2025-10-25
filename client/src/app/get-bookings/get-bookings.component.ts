import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-get-bookings',
  templateUrl: './get-bookings.component.html',
  styleUrls: ['./get-bookings.component.scss']
})
export class GetBookingsComponent {
  itemForm! : FormGroup
  formModel : any
  showError : boolean=false
  errorMessage : boolean=false
  carList : any[] = [] 
  assignModel : any
  showMessage : any
  responseMessage : any
  updateId : any
  toBook : any
  idPaymentNow : any
  selectedBooking : any

  constructor(private fb:FormBuilder,private httpService:HttpService, private router:Router,private authService:AuthService,private datePipe:DatePipe){}

  ngOnInit():void{
    this.itemForm = this.fb.group({
      rentalStartDate:['',Validators.required],
      rentalEndDate:['',Validators.required]
    })
  }
  onSubmit(){
    
  }

  getBookings(){

  }
  bookNow(val){

  }
  payment(val){

  }

}