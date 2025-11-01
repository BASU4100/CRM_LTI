import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  formModel: any = {};
  showError: boolean = false;
  errorMessage: any = '';

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if(this.authService.getLoginStatus) {
      this.router.navigate(['/dashboard']);
    }

    this.itemForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Initialize formModel
    this.formModel = {
      username: 'Enter your username',
      password: 'Enter your password'
    };
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields correctly';
      return;
    }

    const loginData = this.itemForm.value;
    this.httpService.Login(loginData).subscribe({
      next: (response: any) => {
        this.authService.saveToken(response.token)
        this.authService.SetRole(response.role)
        this.authService.saveUserId(response.userId)
        this.authService.saveUsername(response.username)
        this.authService.saveEmail(response.email)
        this.showError = false;
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.showError = true;
        console.error(error);
        this.errorMessage = "Invalid Username or Password";
        setTimeout(() => {
          this.showError = false
          this.errorMessage = ''
        }, 1500);
      }
    });
  }

  registration(): void {
    this.router.navigate(['/registration']);
  }
}