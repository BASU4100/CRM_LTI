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
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize formModel
    this.formModel = { email: '', password: '' };

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
    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        this.showError = false;
        this.errorMessage = '';

        const userRole = this.authService.getUserRole();
        switch (userRole) {
          case 'CUSTOMER':
            this.router.navigate(['/customer']);
            break;
          case 'AGENT':
            this.router.navigate(['/agent']);
            break;
          case 'ADMINISTRATOR':
            this.router.navigate(['/admin']);
            break;
          default:
            this.showError = true;
            this.errorMessage = 'Unknown user role';
        }
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = error.error?.message || 'Invalid email or password';
        console.error(error);
      }
    });
  }
  registration(): void {
    this.router.navigate(['/register']);
  }
}