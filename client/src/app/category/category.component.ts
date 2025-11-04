import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  itemForm!: FormGroup;
  formModel: any;
  showError: boolean = false;
  errorMessage: any;
  categoryList: any[] = [];
  showMessage: boolean = false;
  responseMessage: any;
  updateId: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    else if (this.authService.getRole !== 'ADMINISTRATOR') {
      this.router.navigate(['/dashboard']);
    }

    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      baseRate: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(2000)]]
    });

    this.getCategories();

    this.formModel = {
      name: 'Enter category name',
      description: 'Enter category description',
      baseRate: 'Enter base rate'
    }

    this.updateId = this.route.snapshot.paramMap.get('updateId');
    if (this.updateId) {
      this.httpService.getCategoryById(this.updateId).subscribe(data => this.itemForm.patchValue(data));
    }
  }

  getCategories(): void {
    this.httpService.getAllCategories().subscribe({
      next: (res: any) => this.categoryList = res,
      error: () => this.errorMessage = 'Failed to load categories'
    });
  }

  onCancel(): void {
    this.itemForm.reset();
    this.updateId = null;
    this.showMessage = false;
    this.showError = false;
    this.responseMessage = '';
    this.errorMessage = '';
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    const categoryData = this.itemForm.value;

    if (this.updateId) {
      // Update existing category
      this.httpService.updateCategory(this.updateId, categoryData).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Category updated successfully';
          this.updateId = null;
          // this.itemForm.reset();
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.showError = true;
          this.errorMessage = error.error.text;
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      });
    } else {
      // Create new category
      this.httpService.createCategory(categoryData).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Category added successfully';
          // this.itemForm.reset();
          setTimeout(() => {
            this.showMessage = false;
            this.responseMessage = '';
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.showError = true;
          this.errorMessage = error.error.text;
          setTimeout(() => {
            this.showError = false;
            this.errorMessage = '';
          }, 1500);
        }
      });
    }
  }
}