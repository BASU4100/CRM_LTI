import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

//sorting
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.scss']
})
export class DashbaordComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // admin
  role!: string | null;
  categoryList: any[] = [];
  dataSource: any;
  displayedColumns: string[] = ['name', 'description', 'baseRate', 'action'];
  totalRevenue: number | undefined;
  todayRevenue: number | undefined;

  // agent
  carList: any[] = []
  filteredCarList: any[] = []
  sortDirection: boolean = true
  filterText: string = ''
  
  // customer
  bookingList: any[] = [];

  constructor(private router: Router, private authService: AuthService, private httpService: HttpService) { }

  // check protect component when logged out
  ngOnInit(): void {
    if (!this.authService.getLoginStatus) {
      this.router.navigate(['/login']);
    }
    this.role = this.authService.getRole;
    if (this.role === 'ADMINISTRATOR') {
      this.dataSource = new MatTableDataSource(this.categoryList);
      this.getCategories();
      this.getPayments();
    }
    else if (this.role === 'AGENT') {
      this.dataSource = new MatTableDataSource(this.filteredCarList);
      this.getAllCarsList()
    }
    else {
      this.dataSource = new MatTableDataSource(this.bookingList);
      this.getCustomerBookings();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCustomerBookings() {
    this.httpService.getCustomerBookings().subscribe(
      (response: any) => {
        console.log('Bookings response:', response); // Debug log
        this.bookingList = response;
        this.dataSource.data = response;
      },
      (error: any) => {
        console.error('Error fetching bookings:', error); // Debug log
      }
    );
  }

  getCategories(): void {
    this.httpService.getAllCategories().subscribe({
      next: (res: any[]) => {
        this.categoryList = res;
        this.dataSource.data = res;
      },
      error: () => console.error('Failed to load categories')
    });
  }

  getPayments(): void {
    this.httpService.paymentReport().subscribe(data => {
      this.totalRevenue = data.reduce((total, curr) => total + curr, 0);
      this.todayRevenue = data.filter(payment => payment.paymentDate === new Date()).reduce((total, curr) => total + curr, 0);
    });
  }

  editCategory(category: any): void {
    this.router.navigate(['/category', category.id])
  }

  deleteCategory(categoryId: any) {
    this.httpService.deleteCategoryById(categoryId).subscribe({
      error: (err) => {
        console.log(err.error.message);
        this.ngOnInit();
      }
    });
  }

  getAllCarsList(): void {
    this.httpService.getAllCars().subscribe({
      next: (res: any[]) => {
        this.carList = res;
        this.filteredCarList = res;
        this.dataSource.data = res;
      },
      error: () => {
        console.error('failed to load the cars');
      }
    })
  }

  editCar(car: any): void {
    this.router.navigate(['/add-car', car.id])
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
    this.dataSource.data = this.filteredCarList;
  }
}