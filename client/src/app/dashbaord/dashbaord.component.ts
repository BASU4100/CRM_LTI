import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpService } from '../../services/http.service';

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
  private sortKey: string | null = null;   // 'id' | 'car' | 'start' | 'end' | ...
  private sortAsc = true;

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
  sortColumn(key: string) {
    // Only run for customer
    if (this.role !== null && this.role !== 'ADMINISTRATOR' && this.role !== 'AGENT') {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;           // toggle direction
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }

      const data = [...this.bookingList];
      data.sort((a, b) => this.compare(a, b, key, this.sortAsc));
      this.dataSource.data = data;
    }
  }

  private compare(a: any, b: any, key: string, asc: boolean): number {
    let valA = this.getCustomerValue(a, key);
    let valB = this.getCustomerValue(b, key);

    // Handle null/undefined
    if (valA == null) valA = asc ? -Infinity : Infinity;
    if (valB == null) valB = asc ? -Infinity : Infinity;

    // Dates → timestamp
    if (valA instanceof Date) valA = valA.getTime();
    if (valB instanceof Date) valB = valB.getTime();

    // Strings → lowercase
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    let result = 0;
    if (valA < valB) result = -1;
    if (valA > valB) result = 1;

    return asc ? result : -result;
  }

  private getCustomerValue(item: any, key: string): any {
    switch (key) {
      case 'id': return item.id;
      case 'car': return `${item.car?.make || ''} ${item.car?.model || ''}`.trim();
      case 'start': return new Date(item.rentalStartDate);
      case 'end': return new Date(item.rentalEndDate);
      case 'status': return item.status;
      case 'amount': return item.totalAmount;
      case 'payment': return item.paymentStatus;
      default: return item[key];
    }
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      // AGENT view sorting
      switch (property) {
        case 'category': return item.category?.name?.toLowerCase();
        case 'year': return item.manufactureYear;
        case 'reg': return item.registrationNumber?.toLowerCase();
        case 'rate': return item.rentalRatePerDay;
    
        //customer
        case 'id': return item.id;
        case 'car': return `${item.car?.make} ${item.car?.model}`.toLowerCase();
        case 'start': return new Date(item.rentalStartDate);
        case 'end': return new Date(item.rentalEndDate);
        case 'status': return item.status?.toLowerCase();
        case 'amount': return item.totalAmount;
        case 'payment': return item.paymentStatus?.toLowerCase();

        default: return item[property];
      }
    }
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
      this.totalRevenue = data.map(payment => payment.amount).reduce((total, curr) => total + curr, 0);
      this.todayRevenue = data.filter(payment => new Date(payment.paymentDate).toLocaleDateString() === new Date().toLocaleDateString()).map(payment => payment.amount).reduce((total, curr) => total + curr, 0);
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