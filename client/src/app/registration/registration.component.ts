import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
 
})
export class RegistrationComponent implements OnInit{

  itemForm !: FormGroup
  formModel : any
  showMessage :  any = false; 
  responseMessage : any = '';

  constructor(private router : Router, private httpService : HttpService, private fb : FormBuilder){}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username : ['',[Validators.required,Validators.pattern(/^[A-Za-z0-9._-]+$/)]],
      email : ['',[Validators.required,Validators.email]],
      password : ['',Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@$%&*?])[A-Za-z\d!@$%&*?]+$/)],
      role : ['',Validators.required]
    })
  }

  onRegister() : void{
    if(this.itemForm.valid){
      this.httpService.post(`${environment.apiUrl}/api/user/register`,this.itemForm.value).subscribe({
        next:  (response : any) =>{
          this.showMessage = true
          this.responseMessage = "Registration successfull!"
          this.router.navigate(['login'])   // if this does not work try /login.
        },
        error : (error : any) =>{
          this.showMessage = true
          this.responseMessage = "Registration failed, please try again."
          console.error('Registration error :',error) 
          error.error.responseMessage('Registration error :',error) 
        }
      });

    }else{
      this.showMessage = true
      this.responseMessage = 'Please fill all the fields correctly.'
    }
  }


}