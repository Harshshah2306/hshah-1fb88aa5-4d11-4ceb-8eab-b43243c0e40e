import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 MUST BE HERE
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // 👈 AND HERE
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  // 1. Inject the tools we need
  private http = inject(HttpClient);
  private router = inject(Router);

  // 2. Variables to store form data
  email = '';
  password = '';
  errorMessage = '';


onLogin() {
  this.errorMessage = '';

  // 1. Update the interface to match your Backend Response exactly
  // (Notice: 'accessToken', not 'access_token')
  this.http.post<{ accessToken: string; user: any }>('http://localhost:3000/api/auth/login', {
    email: this.email,
    password: this.password
  }).subscribe({
    next: (response) => {
      console.log('✅ Token Received:', response);
      
      // 2. Save the correct property
      localStorage.setItem('token', response.accessToken); 
      
      // Optional: Save user info too if you need it
      localStorage.setItem('user', JSON.stringify(response.user));

      // 3. Redirect
      this.router.navigate(['/dashboard']); 
    },
    error: (err) => {
      console.error('❌ Login failed', err);
      this.errorMessage = 'Invalid email or password.';
    }
  });
}
}