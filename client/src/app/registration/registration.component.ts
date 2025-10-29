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

  // form structure and placeholder value before the user interacts with the form.
  constructor(private router : Router, private httpService : HttpService, private fb : FormBuilder){}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
<<<<<<< HEAD
      username : ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._-]+$/)]],
      email : ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@$%&*?])[A-Za-z\d!@$%&*?]{8,}$/)]],
      role : ['', Validators.required]
=======
      username : ['',[Validators.required,Validators.minLength(3),Validators.maxLength(15),Validators.pattern(/^[A-Za-z][A-Za-z0-9._-]+$/)]],
      email : ['',[Validators.required,Validators.email]],
      password : ['',Validators.required],
      role : [null,Validators.required]
>>>>>>> adi
    });

    this.formModel = {
      username : 'Username',
      email : 'name@example.com',
      password : '********',
      role : 'Select Role'
    }
  }

  // the user clicks on Register button, if valid then success message is displayed.
  onRegister() : void{
    if(this.itemForm.valid){
      this.httpService.registerUser(this.itemForm.value).subscribe({
        next:  () =>{
          this.showMessage = true
          this.responseMessage = "Registration successfull!"
          
          setTimeout(() => {
            this.showMessage = false
            this.responseMessage = ''
            this.router.navigate(['/login']) 
          }, 1500);
         
          
        },
        // error - scenario
        error : (error : any) =>{
          this.showMessage = true
          this.responseMessage = "Registration failed, please try again."
          console.error('Registration error :',error) 
          //error.error.responseMessage('Registration error :',error) 
          setTimeout(() => {
            this.showMessage = false
            this.responseMessage = ''
          }, 1500);
        }
      });

      // in case the user enters the fields incorrectly, the response message is displayed.
    }else{
      this.showMessage = true
      this.responseMessage = 'Please fill all the fields correctly.'
    }
  }


}