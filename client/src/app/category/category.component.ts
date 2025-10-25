import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit{
   itemForm!: FormGroup;
   formModel:any;
   showError:boolean =false;
   errorMessage:any;
   categoryList:any[]=[];
   assignModel:any;
   showMessage:any;
   responseMessage:any;
   updateId:any;

   constructor(private router:Router,
    private httpService:HttpService,
    private fb:FormBuilder,
    private authService: AuthService){}

    ngOnInit(): void {
      this.itemForm=this.fb.group({
        name:['',[Validators.required,Validators.minLength(3)]],
        description:['',[Validators.required,Validators.minLength(10)]],
        baseRate:['',[Validators.required,Validators.pattern(/^[0-9]+(\\.[0-9]{1,2})?$/)]]
      });
      this.getCategories();
    }

    onSubmit():void{
      const categoryData=this.itemForm.value;
      this.httpService.post(`${environment.apiUrl}/api/administrator/car-categories`,categoryData).subscribe({
        next:() =>{
          this.showMessage = true;
          this.responseMessage='Category added successfully';
          this.getCategories();
        },
        error: () =>{
          this.showError = true;
          this.errorMessage='Error adding category';
        }
      });
    }
    getCategories():void{
      this.httpService.get(`${environment.apiUrl}/api/administrator/car-categories`).subscribe({
        next:(res:any) => this.categoryList = res,
        error: () => this.errorMessage = 'Failed to load categories' 
      })
    }

    edit(val:any): void {
      this.updateId=val.id;
      this.itemForm.patchValue(val);
    }
}