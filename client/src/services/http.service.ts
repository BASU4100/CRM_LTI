import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, retry } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public serverName = environment.apiUrl;
  
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  // Features used by Administrator
  // get all categories from backend 
  getAllCategories() :Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/car-categories`);
  }

  // get all booking by agent related to Booking Report tab on nav bar
  getBookingReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/bookings`);
  }

  // get all payments related to Payment Report tab on nav bar
  paymentReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/administrator/reports/payments`);
  }

  // create a new car category in database
  createCategory(details: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/administrator/car-categories`, details);
  }

  // update an existing category in database
  updateCategory(details: any, updateId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/administrator/car-categories/${updateId}`, details);
  }

  // Features used by the Agent
  // get all cars from the cars table
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/agent/cars`);
  }
  
  // get booking according to agentId
  getBookingByAgent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverName}/api/agent/bookings`);
  }

  // add payments details
  bookingPayment(details: any, bookingId: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/agent/payment/${bookingId}`, details);
  }

  // update status of booking after customer books a car
  updateBookingStatus(bookingId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/agent/bookings/${bookingId}/status`, 'booked');
  }

  // create car related to Add Car nav bar tab
  createCar(details: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/agent/car`, details);
  }

  // update car info in the database
  updateCar(details: any, updateId: any): Observable<any> {
    return this.http.put<any>(`${this.serverName}/api/agent/car/${updateId}`, details);
  }

  // Features used by the Customer
  // add a booking related to the Book Car nav bar tab
  bookACar(details:any, userId:any, carId:any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/customers/booking/${userId}/${carId}`, details);
  }

  // Feature used by RegisterAndLogin controller to validate user and generate a response
  Login(loginData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/login`, loginData);
  }

  // Feature used by RegisterAndLogin controller register a new user
  registerUser(registerData: any): Observable<any> {
    return this.http.post<any>(`${this.serverName}/api/user/register`, registerData);
  }
}