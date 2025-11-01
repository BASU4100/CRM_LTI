import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { HttpService } from "../../services/http.service";


@Component({
    selector: 'app-viewcars',
    templateUrl: './viewcars.component.html',
    styleUrls: ['./viewcars.component.scss']
  })

export class ViewCarsComponent implements OnInit {
    
      carList: any[] = [];
      filteredCarList: any[] = [];
      showError: boolean = false;
      errorMessage: string = '';
      sortDirection: boolean = true;
      filterText: string = '';
  
    constructor(private httpService: HttpService,private router:Router) {}
  
    ngOnInit(): void {
      this.getAllCarsList();
    }
  
    getAllCarsList(): void {
      this.httpService.getAllCars().subscribe({
        next: (res:any[]) => {
          this.carList = res;
          this.filteredCarList = res
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to get cars'
        }
      })
  }

  editCar(car:any):void{
    this.router.navigate(['/add-car',car.id])
  }

    sortBy(column: string): void {
        this.filteredCarList.sort((a, b) => {
          const valA = this.getNestedValue(a, column)?.toString().toLowerCase();
          const valB = this.getNestedValue(b, column)?.toString().toLowerCase();
    
          if (valA < valB) return this.sortDirection ? -1 : 1;
          if (valA > valB) return this.sortDirection ? 1 : -1;
          return 0;
        });
    
        this.sortDirection = !this.sortDirection;
      }
    
      getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
      }
    
      applyFilter(): void {
        const text = this.filterText.toLowerCase();
        this.filteredCarList = this.carList.filter(car =>
          car.make.toLowerCase().includes(text) ||
          car.model.toLowerCase().includes(text) ||
          car.registrationNumber.toLowerCase().includes(text)
        );
      }
}
  