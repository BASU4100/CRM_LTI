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
  ) {}

  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }

    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      baseRate: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]]
    });

    this.getCategories();
  }

  onSubmit(): void {
    const categoryData = this.itemForm.value;

    if (this.updateId) {
      // Update existing category
      this.httpService.updateCategory(this.updateId, categoryData).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Category updated successfully';
          this.getCategories();
          this.updateId = null;
          this.itemForm.reset();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Error updating category';
        }
      });
    } else {
      // Create new category
      this.httpService.createCategory(categoryData).subscribe({
        next: () => {
          this.showMessage = true;
          this.responseMessage = 'Category added successfully';
          this.getCategories();
          this.itemForm.reset();
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Error adding category';
        }
      });
    }
  }

  getCategories(): void {
    this.httpService.getAllCategories().subscribe({
      next: (res: any) => this.categoryList = res,
      error: () => this.errorMessage = 'Failed to load categories'
    });
  }

  edit(val: any): void {
    this.updateId = val.id;
    this.itemForm.patchValue(val);
  }
}