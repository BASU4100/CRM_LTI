import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';


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
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Initialize formModel
    this.formModel = { username: '', password: '' };

    // Sync formModel with form values
    this.itemForm.valueChanges.subscribe(value => {
      this.formModel = { ...value };
    });
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
        this.showError = false;
        this.errorMessage = '';
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = error.error?.message || 'Invalid email or password';
        setTimeout(() => {
          this.showError = false
          this.errorMessage = ''
        }, 1500);
        console.error(error);
      }
    });
  }
  
  registration(): void {
    this.router.navigate(['/registration']);
  }
}