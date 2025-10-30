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
  filteredList : any=[];
  selectedStatus : string = ''
  roleName : string | null = null;

  // form structure and placeholder value before the user interacts with the form.
  constructor(public router:Router, public httpService:HttpService, private formBuilder: FormBuilder, private authService:AuthService,private datePipe: DatePipe){}
  

  // load payment-report only if the role is ADMIN.
  ngOnInit(): void {
    if(!this.authService.getLoginStatus){
      this.router.navigate(['/login']);
    }else{
      this.roleName = this.authService.getRole;
      if(this.roleName !== 'ADMINISTRATOR'){ 
        this.router.navigate(['/dashboard']);
      }
      this.getPaymentReport();
    }
  }

  //method that gets the payment report and is called immediately as the page loads.
  getPaymentReport() {
    this.bookingList=[];
    this.httpService.paymentReport().subscribe({
      next : (res : any[]) => {
        this.bookingList=res;
         
        this.showMessage = true;
        this.responseMessage = 'Payment report has been loaded successfully';
        setTimeout(() => {
          this.showMessage = false
          this.responseMessage = ''
        }, 1500);
        
      }, 
      // error - scenario
      error : () => {

        this.showError = true;
        this.errorMessage = "An error occurred.. Please try again later.";
        setTimeout(() => {
          this.showError = false
          this.errorMessage = ''
        }, 1500);
        }
        
      });
  }
  // filtering on the basis of status
  filterByStatus(){
    if(!this.selectedStatus){
      this.filteredList = this.bookingList;
    }else{
      this.filteredList = this.bookingList.filter((val : any) => val.paymentStatus === this.selectedStatus);
    }
  }
  
}

