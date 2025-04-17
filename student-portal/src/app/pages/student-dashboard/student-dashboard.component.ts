// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-student-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './student-dashboard.component.html'
// })
// export class StudentDashboardComponent {
//   name = '';
//   rollNo = '';
//   isSubmitting = false;
//   successMessage = '';
//   errorMessage = '';

//   constructor(public authService: AuthService) {}

//   async submitForm() {
//     this.successMessage = '';
//     this.errorMessage = '';

//     if (!this.name.trim() || !this.rollNo.trim()) {
//       this.errorMessage = 'Please enter both name and roll number.';
//       return;
//     }

//     this.isSubmitting = true;
//     try {
//       await this.authService.requestRegistration(this.name.trim(), this.rollNo.trim());
//       this.successMessage = '✅ Registration request sent!';
//       this.name = '';
//       this.rollNo = '';
//     } catch (err) {
//       console.error('Registration failed:', err);
//       this.errorMessage = '❌ Failed to send registration.';
//     } finally {
//       this.isSubmitting = false;
//     }
//   }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html'
})
export class StudentDashboardComponent {
  name = '';
  rollNo = '';
  courseName = ''; // New field for course name
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(public authService: AuthService) {}

  async submitForm() {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.name.trim() || !this.rollNo.trim() || !this.courseName.trim()) {
      this.errorMessage = 'Please enter your name, roll number, and course name.';
      return;
    }

    this.isSubmitting = true;
    try {
      // Call requestRegistration with the courseName
      await this.authService.requestRegistration(this.name.trim(), this.rollNo.trim(), this.courseName.trim());
      this.successMessage = '✅ Registration request sent!';
      this.name = '';
      this.rollNo = '';
      this.courseName = ''; // Reset course name field
    } catch (err) {
      console.error('Registration failed:', err);
      this.errorMessage = '❌ Failed to send registration.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
