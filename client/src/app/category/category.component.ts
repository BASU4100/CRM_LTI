import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private authService: AuthService
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
  }

  edit(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue(val);
  }

  getCategories(): void {
      this.httpService.getAllCategories().subscribe({
        next: (res: any) => this.categoryList = res,
        error: () => this.errorMessage = 'Failed to load categories'
      });
    }

    deleteCategory(id: any): void {
      if (confirm('Are you sure you want to delete this category?')) {
        this.httpService.deleteCategory(id).subscribe({
          next: () => {
            this.showMessage = true;
            this.getCategories();
            this.responseMessage = 'Category deleted successfully';
            setTimeout(() => {
              this.showMessage = false;
              this.responseMessage = '';
            }, 1500);
          },
          error: (error) => {
            this.showError = true;
            this.errorMessage = error.error.text || 'Failed to delete category';
            setTimeout(() => {
              this.showError = false;
              this.errorMessage = '';
            }, 1500);
          }
        });
      }
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
          this.itemForm.reset();
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
          this.itemForm.reset();
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