import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // 👈 Added ActivatedRoute
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // 1. Mock HTTP
    httpMock = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn()
    };

    // 2. Mock Router (Prevent 'Cannot match route' error)
    routerMock = {
      navigate: jest.fn(),
      url: '/dashboard',
      createUrlTree: jest.fn(), 
      serializeUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent, 
      ],
      providers: [
        { provide: HttpClient, useValue: httpMock },
        { provide: Router, useValue: routerMock }, // 👈 Mock Router Navigation
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: () => null } } } // 👈 Mock Active Route
        },
        ChangeDetectorRef
      ]
    }).compileComponents();

    // 3. Mock LocalStorage (Simulate User)
    const mockUser = { id: 1, email: 'admin@test.com', role: 'ADMIN' };
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser);
      if (key === 'token') return 'fake-token';
      return null;
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the dashboard', () => {
    httpMock.get.mockReturnValue(of([])); // Default return
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
  });

  it('should fetch tasks on initialization', () => {
    const dummyTasks = [
      { id: 1, title: 'Task A', status: 'OPEN' },
      { id: 2, title: 'Task B', status: 'DONE' }
    ];
    
    // Handle API calls
    httpMock.get.mockImplementation((url: string) => {
      if (url.includes('tasks')) return of(dummyTasks);
      return of([]);
    });

    fixture.detectChanges(); 

    // Verify
    expect(component.todo.length).toBe(1);
    expect(component.done.length).toBe(1);
    expect(httpMock.get).toHaveBeenCalled();
  });
});