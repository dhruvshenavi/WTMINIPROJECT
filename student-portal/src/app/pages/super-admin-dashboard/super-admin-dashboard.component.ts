// import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-super-admin-dashboard',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './super-admin-dashboard.component.html',
//   styleUrls: ['./super-admin-dashboard.component.css']
// })
// export class SuperAdminDashboardComponent implements OnInit {
//   // Form inputs
//   teacherAddress = '';
//   teacherRole = 'teacher';     // default to "teacher" if you like
//   teacherSubject = '';

//   // List of all admins to display
//   admins: Array<{
//     address: string;
//     role: string;
//     subjectOrBatch: string;
//   }> = [];

//   constructor(private authService: AuthService) {}

//   ngOnInit(): void {
//     // Load the current list of admins
//     this.loadAdmins();
//   }

//   async loadAdmins() {
//     try {
//       const adminAddresses = await this.authService.getAllAdmins();
//       this.admins = [];

//       for (const addr of adminAddresses) {
//         try {
//           // getTeacher reverts if the admin is inactive
//           const { role, subjectOrBatch } = await this.authService.getTeacher(addr);
//           this.admins.push({ address: addr, role, subjectOrBatch });
//         } catch (err) {
//           // If getTeacher() reverts, it means they're not active. We skip.
//         }
//       }
//     } catch (error) {
//       console.error('Error loading admins:', error);
//     }
//   }

//   async addNewTeacher() {
//     try {
//       await this.authService.addAdmin(this.teacherAddress, this.teacherRole, this.teacherSubject);
//       // Refresh the list
//       await this.loadAdmins();

//       // Clear form fields
//       this.teacherAddress = '';
//       this.teacherRole = 'teacher';
//       this.teacherSubject = '';
//     } catch (error) {
//       console.error('Error adding teacher:', error);
//     }
//   }

//   async removeTeacher(address: string) {
//     try {
//       await this.authService.removeAdmin(address);
//       // Refresh the list
//       await this.loadAdmins();
//     } catch (error) {
//       console.error('Error removing teacher:', error);
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,              // Standalone component
  imports: [CommonModule, FormsModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {

  // Form inputs
  teacherAddress = '';
  teacherRole = 'teacher'; // Default role
  teacherSubject = '';

  // List of all admins
  admins: Array<{
    address: string;
    role: string;
    subjectOrBatch: string;
  }> = [];

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    // Load admins once the component initializes
    await this.loadAdmins();
  }

  // Load the list of admin addresses, then get each admin’s details
  async loadAdmins(): Promise<void> {
    try {
      const adminAddresses = await this.authService.getAllAdmins();
      this.admins = [];

      for (const addr of adminAddresses) {
        try {
          // getTeacher reverts if the admin is inactive
          const { role, subjectOrBatch } = await this.authService.getTeacher(addr);
          this.admins.push({ address: addr, role, subjectOrBatch });
        } catch (err) {
          // If getTeacher() reverts, admin is inactive — skip
        }
      }
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  }

  // // Add a new teacher/admin to the contract
  // async addNewTeacher(): Promise<void> {
  //   try {
  //     await this.authService.addAdmin(this.teacherAddress, this.teacherRole, this.teacherSubject);
  //     await this.loadAdmins();

  //     // Clear form fields
  //     this.teacherAddress = '';
  //     this.teacherRole = 'teacher';
  //     this.teacherSubject = '';
  //   } catch (error) {
  //     console.error('Error adding teacher:', error);
  //   }
  // }

  async addNewTeacher(): Promise<void> {
    try {
      await this.authService.addAdmin(this.teacherAddress, this.teacherRole, this.teacherSubject);
      
      // Add a delay (e.g., 2 seconds) before reloading the admin list
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.loadAdmins();
  
      // Clear form fields
      this.teacherAddress = '';
      this.teacherRole = 'teacher';
      this.teacherSubject = '';
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  }
  

  // Remove an existing teacher/admin from the contract
  async removeTeacher(address: string): Promise<void> {
    try {
      await this.authService.removeAdmin(address);
      await this.loadAdmins();
    } catch (error) {
      console.error('Error removing teacher:', error);
    }
  }
}

