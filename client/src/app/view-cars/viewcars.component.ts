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
    showError: boolean = false;
    errorMessage: string = '';
  
    constructor(private httpService: HttpService) {}
  
    ngOnInit(): void {
      this.getAllCarsList();
    }
  
    getAllCarsList(): void {
      this.httpService.getAllCars().subscribe({
        next: (res:any[]) => {
          this.carList = res;
        },
        error: () => {
          this.showError = true;
          this.errorMessage = 'Failed to get cars'
        }
        

      })
  }
}
  