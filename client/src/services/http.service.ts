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
 
  // Helper method to get headers with Authorization token
  // private getHeaders(): HttpHeaders {
  //   const token = this.authService.getToken();
  //   return new HttpHeaders({
  //     'Authorization': `Bearer ${token || ''}`,
  //     'Content-Type': 'application/json'
  //   });
  // }

  httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };
 
  // Features used by Administrator
  // Get all categories from backend
  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/car-categories`/**, { headers: this.getHeaders() } */);
  }
 
  // Get all bookings related to Booking Report tab on nav bar
  getBookingReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/bookings`/**, { headers: this.getHeaders() } */);
  }
 
  // Get all payments related to Payment Report tab on nav bar
  paymentReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/payments`/**, { headers: this.getHeaders() } */);
  }
 
  // Create a new car category in database
  createCategory(details: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/administrator/car-categories`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Update an existing category in database
  updateCategory(details: any, updateId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/administrator/car-categories/${updateId}`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Features used by Agent
  // Get all cars from the cars table
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/customers/cars/available`/**, { headers: this.getHeaders() } */);
  }
 
  // Get all bookings for the agent
  getBookingByAgent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/agent/bookings`/**, { headers: this.getHeaders() } */);
  }
 
  // Add payment details
  bookingPayment(details: any, bookingId: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/agent/payment/${bookingId}`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Update status of booking after customer books a car
  updateBookingStatus(bookingId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/agent/bookings/${bookingId}/status?status=booked`,{}/**, { headers: this.getHeaders() } */);
  }
 
  // Create car related to Add Car nav bar tab
  createCar(details: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/agent/car`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Update car info in the database
  updateCar(details: any, updateId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/agent/car/${updateId}`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Features used by Customer
  // Add a booking related to the Book Car nav bar tab
  bookACar(details: any, userId: any, carId: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/customers/booking?userId=${userId}&carId=${carId}`, details/**, { headers: this.getHeaders() } */);
  }
 
  // Feature used by RegisterAndLogin controller to validate user and generate a response
  Login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/login`, loginData, this.httpOptions);
  }
 
  // Feature used by RegisterAndLogin controller to register a new user
  registerUser(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/register`, registerData);
  }
}