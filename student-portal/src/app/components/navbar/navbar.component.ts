// // import { Component } from '@angular/core';

// // @Component({
// //   selector: 'app-navbar',
// //   imports: [],
// //   templateUrl: './navbar.component.html',
// //   styleUrl: './navbar.component.css'
// // })
// // export class NavbarComponent {

// // }
// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common'; // <-- clearly import this

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule],  // <-- clearly add this here
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {
//   constructor(public auth: AuthService, private router: Router) {}

//   async login() {
//     await this.auth.loginWithMetaMask();
//     const role = this.auth.getUserRole();

//     if (role === 'student') {
//       this.router.navigate(['/student-dashboard']);
//     } else if (role === 'teacher') {
//       this.router.navigate(['/teacher-dashboard']);
//     } else if (role === 'admin') {
//       this.router.navigate(['/super-admin-dashboard']);
//     } else if (role === 'pending') {
//       alert('Your registration is pending approval.');
//     } else {
//       alert('You are not registered.');
//     }
//   }

//   logout() {
//     this.auth.logout();
//     this.router.navigate(['/dashboard']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userRole = '';

  constructor(public auth: AuthService, public router: Router) {}
  


  ngOnInit(): void {
    this.userRole = this.auth.getUserRole();
    this.auth.roleChanged.subscribe((role) => {
      this.userRole = role;
    });
  }

  async login() {
    await this.auth.loginWithMetaMask();
    const role = this.auth.getUserRole();

    if (role === 'student') {
      this.router.navigate(['/student-dashboard']);
    } else if (role === 'teacher') {
      this.router.navigate(['/teacher-dashboard']);
    } else if (role === 'admin') {
      this.router.navigate(['/super-admin-dashboard']);
    } else if (role === 'pending') {
      alert('Your registration is pending approval.');
    } else {
      alert('You are not registered.');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/dashboard']);
  }
}

