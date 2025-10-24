import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from '../app/category/category.component';
import { HttpService } from '../services/http.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let mockHttpService: jasmine.SpyObj<HttpService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockHttpService = jasmine.createSpyObj('HttpService', ['getAllCategories', 'createCategory', 'updateCategory']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['someMethod']);
    
    await TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: HttpService, useValue: mockHttpService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;

    // Mocking the HttpService methods to return observables
    mockHttpService.getAllCategories.and.returnValue(of([]));
    mockHttpService.createCategory.and.returnValue(of({}));
    mockHttpService.updateCategory.and.returnValue(of({}));

    fixture.detectChanges();
  });

  it('should mark the form as invalid if required fields are empty', () => {
    component.itemForm.patchValue({
      name: '',
      description: '',
      baseRate: null
    });
    expect(component.itemForm.valid).toBeFalse();
  });

  it('should mark the form as valid if all required fields are filled', () => {
    component.itemForm.patchValue({
      name: 'Economy',
      description: 'Basic economy category',
      baseRate: 100
    });
    expect(component.itemForm.valid).toBeTrue();
  });
});
