import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from '../environments/environment.development';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';


describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpService,
        { provide: AuthService, useValue: { getToken: () => 'mockToken' } }
      ]
    });
    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test cases for HttpService methods

  it('should retrieve all categories', () => {
    const mockResponse = [{ id: 1, name: 'SUV' }, { id: 2, name: 'Sedan' }];

    service.getAllCategories().subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/administrator/car-categories`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should retrieve bookings by agent', () => {
    const mockResponse = [{ id: 1, status: 'Booked' }, { id: 2, status: 'Cancelled' }];

    service.getBookingByAgent().subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/agent/bookings`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should retrieve payment report', () => {
    const mockResponse = [{ id: 1, amount: 500 }, { id: 2, amount: 300 }];

    service.paymentReport().subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/administrator/reports/payments`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should retrieve booking report', () => {
    const mockResponse = [{ id: 1, bookingId: 'B001' }, { id: 2, bookingId: 'B002' }];

    service.getBookingReport().subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/administrator/reports/bookings`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should retrieve all available cars', () => {
    const mockResponse = [{ id: 1, model: 'Toyota' }, { id: 2, model: 'Honda' }];

    service.getCars().subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers/cars/available`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should book a car', () => {
    const details = { date: '2024-08-27', time: '10:00' };
    const userId = 1;
    const carId = 101;
    const mockResponse = { success: true };

    service.bookACar(details, userId, carId).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/customers/booking?userId=${userId}&carId=${carId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should process booking payment', () => {
    const details = { amount: 100 };
    const bookingId = 1;
    const mockResponse = { success: true };

    service.bookingPayment(details, bookingId).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/agent/payment/${bookingId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should update booking status', () => {
    const bookingId = 1;
    const mockResponse = { success: true };

    service.updateBookingStatus(bookingId).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/agent/bookings/${bookingId}/status?status=booked`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    req.flush(mockResponse);
  });

  it('should update a car', () => {
    const details = { model: 'Toyota' };
    const UpdateId = 1;
    const mockResponse = { success: true };

    service.updateCar(details, UpdateId).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/agent/car/${UpdateId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should create a car', () => {
    const details = { model: 'Honda' };
    const mockResponse = { success: true };

    service.createCar(details).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/agent/car`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should create a category', () => {
    const details = { name: 'Luxury' };
    const mockResponse = { success: true };

    service.createCategory(details).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/administrator/car-categories`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should update a category', () => {
    const details = { name: 'SUV' };
    const updateId = 1;
    const mockResponse = { success: true };

    service.updateCategory(details, updateId).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/administrator/car-categories/${updateId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should login', () => {
    const details = { username: 'testuser', password: 'testpassword' };
    const mockResponse = { token: 'mockToken' };

    service.Login(details).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });

  it('should register a user', () => {
    const details = { username: 'newuser', password: 'newpassword' };
    const mockResponse = { success: true };

    service.registerUser(details).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(details);
    req.flush(mockResponse);
  });
});

