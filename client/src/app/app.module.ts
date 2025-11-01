import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { DashbaordComponent } from './dashbaord/dashbaord.component';

import { CategoryComponent } from './category/category.component';
import { AddCarComponent } from './add-car/add-car.component';
import { CarsComponent } from './cars/cars.component';
import { DatePipe } from '@angular/common';
import { GetBookingsComponent } from './get-bookings/get-bookings.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { AuthInterceptor } from './auth.interceptors';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { ViewCarsComponent } from './view-cars/viewcars.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashbaordComponent,
    CategoryComponent,
    AddCarComponent,
    CarsComponent,
    GetBookingsComponent,
    BookingReportComponent,
    PaymentReportComponent,
    AppNavbarComponent,
    ViewCarsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        MatSnackBarModule
       
  ],
  providers: [HttpService, 
    HttpClientModule, 
    DatePipe, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
