import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CarsComponent } from '../app/cars/cars.component';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

describe('CarsComponent', () => {
  let component: CarsComponent;
  let fixture: ComponentFixture<CarsComponent>;
  let mockHttpService: jasmine.SpyObj<HttpService>;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['getCars', 'bookACar']);
    
    await TestBed.configureTestingModule({
      declarations: [CarsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: Router, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: DatePipe }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarsComponent);
    component = fixture.componentInstance;

    // Mocking the HttpService methods to return observables
    mockHttpService.getCars.and.returnValue(of([]));
    mockHttpService.bookACar.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should mark the form as invalid if rental start and end dates are empty', () => {
    component.itemForm.patchValue({
      rentalStartDate: '',
      rentalEndDate: ''
    });
    expect(component.itemForm.valid).toBeFalse();
  });

  it('should mark the form as valid if rental start and end dates are provided', () => {
    component.itemForm.patchValue({
      rentalStartDate: '2023-08-27T10:00:00',
      rentalEndDate: '2023-08-28T10:00:00'
    });
    expect(component.itemForm.valid).toBeTrue();
  });
});
