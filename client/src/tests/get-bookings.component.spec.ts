import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { GetBookingsComponent } from '../app/get-bookings/get-bookings.component';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

describe('GetBookingsComponent', () => {
  let component: GetBookingsComponent;
  let fixture: ComponentFixture<GetBookingsComponent>;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let datePipe: DatePipe;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['getBookingByAgent', 'bookingPayment', 'updateBookingStatus']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['someMethod']);
    datePipe = new DatePipe('en-US');

    await TestBed.configureTestingModule({
      declarations: [GetBookingsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: DatePipe, useValue: datePipe }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBookingsComponent);
    component = fixture.componentInstance;
    
    // Mocking the HttpService methods to return observables
    mockHttpService.getBookingByAgent.and.returnValue(of([]));
    mockHttpService.bookingPayment.and.returnValue(of({}));
    mockHttpService.updateBookingStatus.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should mark the form as invalid if required fields are empty', () => {
    component.itemForm.patchValue({
      amount: '',
      paymentDate: '',
      paymentMethod: '',
      paymentStatus: ''
    });
    expect(component.itemForm.valid).toBeFalse();
  });

  it('should mark the form as valid if all required fields are filled', () => {
    component.itemForm.patchValue({
      amount: 100,
      paymentDate: new Date(),
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed'
    });
    expect(component.itemForm.valid).toBeTrue();
  });
});
