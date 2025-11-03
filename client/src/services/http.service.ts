import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';
 
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;
 
  constructor(private http: HttpClient, private authService: AuthService) {}

  httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
 
  // Features used by Administrator
  // Get all categories from backend
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/car-categories`);
  }

  // Get category by Id
  getCategoryById(updateId: any): Observable<any> {
    return this.http.get<any>(`${this.serverName}/api/administrator/car-categories/${updateId}`);
  }
 
  // Get all bookings related to Booking Report tab on nav bar
  getBookingReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/bookings`);
  }
 
  // Get all payments related to Payment Report tab on nav bar
  paymentReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/payments`);
  }
 
  // Create a new car category in database
  createCategory(details: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/administrator/car-categories`, details);
  }
 
  // Update an existing category in database
  updateCategory(updateId: any, details: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/administrator/car-categories/${updateId}`, details);
  }

  // Delete a car category by ID
  deleteCategoryById(id: any): Observable<any> {
    return this.http.delete<any>(`${this.serverName}/api/administrator/car-categories/${id}`);
  }
 
  // Features used by Agent
  // Get all cars from the cars table
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/customers/cars/available`);
  }

  getAllCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/agent/cars`);
  }
 
  // Get all bookings for the agent
  getBookingByAgent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/agent/bookings`);
  }

  deleteBookingByAgent(id:number): Observable<any> {
    return this.http.delete<any>(`${this.serverName}/api/agent/bookings/${id}`);
  }
 
  // Add payment details
  bookingPayment(details: any, bookingId: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/agent/payment/${bookingId}`, details);
  }
 
  // Update status of booking after customer books a car
  updateBookingStatus(bookingId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/agent/bookings/${bookingId}/status?status=booked`,{});
  }
 
  // Create car related to Add Car nav bar tab
  // createCar(details: any): Observable<any> {
  //  // details.category = { id: details.category};
  //   return this.http.post<any>(`${this.serverName}/api/agent/car`, details);
  // }
  createCar(details: any, image?: File): Observable<any> {
     const formData = new FormData();
     formData.append('car', new Blob([JSON.stringify(details)], { type: 'application/json' }));
     if (image) {
       formData.append('image', image, image.name);
     }
    //  const headers = new HttpHeaders({
    //    'Authorization': `Bearer ${localStorage.getItem('token')}`
    //  });
     return this.http.post<any>(`${this.serverName}/api/agent/car`, formData);
   }


  // Update car info in the database
  // updateCar(updateId: any,details: any): Observable<any> {
  //   return this.http.put<any>(`${this.serverName}/api/agent/car/${updateId}`, details);
  // }
 updateCar(updateId: any, details: any, image?: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('car', new Blob([JSON.stringify(details)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image, image.name);
    }
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${localStorage.getItem('token')}`
    // });
    return this.http.put<any>(`${this.serverName}/api/agent/car/${updateId}`, formData);
  }
 
  // Features used by Customer
  // Add a booking related to the Book Car nav bar tab
  bookACar(details: any, userId: any, carId: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/customers/booking?userId=${userId}&carId=${carId}`, details);
  }
 
  // Feature used by RegisterAndLogin controller to validate user and generate a response
  Login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/login`, loginData, this.httpOptions);
  }
 
  // Feature used by RegisterAndLogin controller to register a new user
  registerUser(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/register`, registerData);
  }

  //customer bookings for customer
  getCustomerBookings(): Observable<any>{
    return this.http.get(`${this.serverName}/api/customers/booking`);
  }


}