import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import RouterLink for navigation

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.css'], // We will reuse the login styles or create new ones
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  onRegister() {
    this.http.post('http://localhost:3000/api/auth/register', {
      email: this.email,
      password: this.password,
      // We send defaults for now since we don't have these fields in the UI yet
      organizationId: 'default-org',
      role: 'VIEWER'
    }).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        // Redirect to login page after success
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. User might already exist.';
        console.error(err);
      }
    });
  }
}