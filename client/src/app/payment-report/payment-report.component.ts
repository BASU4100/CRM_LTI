import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  formModel:any={status:null};
  showError:boolean=false;
  errorMessage:any;
  carList:any=[];
  assignModel: any={};

  showMessage: any;
  responseMessage: any;
  updateId: any;
  toBook: any={};
  bookingList: any=[];
  constructor(public router:Router, public httpService:HttpService, private formBuilder: FormBuilder, private authService:AuthService,private datePipe: DatePipe) 
  {
      
  }
  ngOnInit(): void {

    this.getPaymentReport();
  }
  getPaymentReport() {
    this.bookingList=[];
    this.httpService.paymentReport().subscribe((data: any) => {
      this.bookingList=data;
      console.log(this.bookingList);
    }, error => {
      // Handle error
      this.showError = true;
      this.errorMessage = "An error occurred.. Please try again later.";
      console.error('Login error:', error);
    });;
  }

 
 
  
}

