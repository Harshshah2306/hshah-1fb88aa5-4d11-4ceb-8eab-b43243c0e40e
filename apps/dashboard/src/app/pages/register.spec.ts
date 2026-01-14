import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent], 
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) // 👈 This provides BOTH Router and ActivatedRoute (Fixes NG0201)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    // Inject services so we can control them
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    // 👈 Spy on the navigate method so we can check it without actually moving
    jest.spyOn(router, 'navigate').mockImplementation(async () => true);

    fixture.detectChanges();
  });

  afterEach(() => {
    // Only verify if httpMock was successfully created
    if (httpMock) {
      httpMock.verify();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login on success', () => {
    component.email = 'test@test.com';
    component.password = '123456';

    component.onRegister();

    const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
    req.flush({ success: true });

    // Verify our spy was called
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});