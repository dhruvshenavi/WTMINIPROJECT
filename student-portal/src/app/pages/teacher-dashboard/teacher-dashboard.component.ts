// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-teacher-dashboard',
//   imports: [],
//   templateUrl: './teacher-dashboard.component.html',
//   styleUrl: './teacher-dashboard.component.css'
// })
// export class TeacherDashboardComponent {

// }


// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// interface StudentInfo {
//   address: string;
//   name: string;
//   rollNo: string;
//   courseName: string;
//   attendance: number;
// }

// @Component({
//   selector: 'app-teacher-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './teacher-dashboard.component.html',
//   styleUrls: ['./teacher-dashboard.component.css']
// })
// export class TeacherDashboardComponent implements OnInit {

//   pendingStudents: StudentInfo[] = [];
//   registeredStudents: StudentInfo[] = [];
//   teacherSubject: string = '';

//   constructor(private authService: AuthService) {}

//   async ngOnInit(): Promise<void> {
//     // Get the teacher's subject from the contract
//     const teacherAddr = this.authService.getUserAddress();
//     const { subjectOrBatch } = await this.authService.getTeacher(teacherAddr);
//     this.teacherSubject = subjectOrBatch;

//     await this.loadStudents();
//   }

//   // Load all students and separate them into pending and registered lists based on course match
//   async loadStudents(): Promise<void> {
//     try {
//       const studentAddresses = await this.authService.getAllStudents();
//       const pendingList: StudentInfo[] = [];
//       const registeredList: StudentInfo[] = [];

//       for (const addr of studentAddresses) {
//         // Get the student's info
//         try {
//           const studentInfo = await this.authService.getStudentInfo(addr);
//           // Filter by teacher's subject
//           if (studentInfo.courseName === this.teacherSubject) {
//             const isPending = await this.authService.isPending(addr);
//             if (isPending) {
//               pendingList.push({ address: addr, ...studentInfo });
//             } else {
//               // Registered students
//               registeredList.push({ address: addr, ...studentInfo });
//             }
//           }
//         } catch (err) {
//           console.error(`Error fetching info for student ${addr}:`, err);
//         }
//       }
//       this.pendingStudents = pendingList;
//       this.registeredStudents = registeredList;
//     } catch (error) {
//       console.error('Error loading students:', error);
//     }
//   }

//   // Approve a pending student
//   async approveStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.approveStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error approving student:', error);
//     }
//   }

//   // Decline a pending student
//   async declineStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.declineStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error declining student:', error);
//     }
//   }

//   // Remove a registered student (if you have this functionality)
//   async removeRegisteredStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.removeRegisteredStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error removing registered student:', error);
//     }
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// interface StudentInfo {
//   address: string;
//   name: string;
//   rollNo: string;
//   courseName: string;
//   attendance: number;
// }

// @Component({
//   selector: 'app-teacher-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './teacher-dashboard.component.html',
//   styleUrls: ['./teacher-dashboard.component.css']
// })
// export class TeacherDashboardComponent implements OnInit {

//   pendingStudents: StudentInfo[] = [];
//   registeredStudents: StudentInfo[] = [];
//   teacherSubject: string = '';

//   constructor(private authService: AuthService) {}

//   async ngOnInit(): Promise<void> {
//     // Ensure the wallet is connected and user address is available.
//     await this.authService.checkWalletConnected();
//     const teacherAddr = this.authService.getUserAddress();
//     if (!teacherAddr) {
//       console.error('User address is empty. Please log in.');
//       return;
//     }
    
//     try {
//       // Fetch the teacher's subject from the contract using the teacher's address.
//       const { subjectOrBatch } = await this.authService.getTeacher(teacherAddr);
//       this.teacherSubject = subjectOrBatch;
//       // Now load pending and registered students
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error fetching teacher info:', error);
//     }
//   }

//   // Load all students and separate them into pending and registered lists based on course match.
//   async loadStudents(): Promise<void> {
//     try {
//       const studentAddresses = await this.authService.getAllStudents();
//       const pendingList: StudentInfo[] = [];
//       const registeredList: StudentInfo[] = [];

//       for (const addr of studentAddresses) {
//         try {
//           // Get student info (name, rollNo, courseName, attendance)
//           const studentInfo = await this.authService.getStudentInfo(addr);
//           // Filter by teacher's subject (i.e. courseName must match teacher's subject)
//           if (studentInfo.courseName === this.teacherSubject) {
//             const isPending = await this.authService.isPending(addr);
//             if (isPending) {
//               pendingList.push({ address: addr, ...studentInfo });
//             } else {
//               registeredList.push({ address: addr, ...studentInfo });
//             }
//           }
//         } catch (err) {
//           console.error(`Error fetching info for student ${addr}:`, err);
//         }
//       }
//       this.pendingStudents = pendingList;
//       this.registeredStudents = registeredList;
//     } catch (error) {
//       console.error('Error loading students:', error);
//     }
//   }

//   // Approve a pending student
//   async approveStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.approveStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error approving student:', error);
//     }
//   }

//   // Decline a pending student
//   async declineStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.declineStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error declining student:', error);
//     }
//   }

//   // Remove a registered student (if desired)
//   async removeRegisteredStudent(studentAddr: string): Promise<void> {
//     try {
//       await this.authService.removeRegisteredStudent(studentAddr);
//       await this.loadStudents();
//     } catch (error) {
//       console.error('Error removing registered student:', error);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface StudentInfo {
  address: string;
  name: string;
  rollNo: string;
  courseName: string;
  attendance: number;
}

interface AttendanceRequestView {
  id: number;
  deadline: number;
  markedStudents: StudentInfo[];
  unmarkedStudents: StudentInfo[];
}

interface CombinedAttendanceInfo {
  address: string;         // Student address
  name: string;
  rollNo: string;
  attendance: number;
  requestId: number;
  deadline: number;        // from the request
  markedTime?: number;     // if they marked attendance, store the block.timestamp
}


@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {

  teacherSubject: string = '';
  pendingStudents: StudentInfo[] = [];
  registeredStudents: StudentInfo[] = [];
  attendanceRequestsView: AttendanceRequestView[] = [];
  // Add these two arrays at the class level:
  //allMarked: StudentInfo[] = [];
  //allUnmarked: StudentInfo[] = [];
  allMarked: CombinedAttendanceInfo[] = [];
  allUnmarked: CombinedAttendanceInfo[] = [];

  // Bound to the attendance request form
  newDeadline: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    // Ensure wallet is connected and user address is set
    await this.authService.checkWalletConnected();
    const teacherAddr = this.authService.getUserAddress();
    console.log("Teacher Address:", teacherAddr);
    if (!teacherAddr) {
      console.error("Teacher address not available. Please log in with the correct account.");
      return;
    }
    
    // Now that we know the address is set, fetch teacher details
    try {
      const teacherData = await this.authService.getTeacher(teacherAddr);
      this.teacherSubject = teacherData.subjectOrBatch;
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      return;
    }
    
    // Continue with loading other data (students, attendance requests, etc.)
    await this.loadStudents();
    await this.loadAttendanceRequests();
  }
  
  // Load student registration data: pending and registered students for the teacher's course.
  async loadStudents(): Promise<void> {
    try {
      const studentAddresses = await this.authService.getAllStudents();
      const pendingList: StudentInfo[] = [];
      const registeredList: StudentInfo[] = [];
      
      for (const addr of studentAddresses) {
        try {
          const studentInfo = await this.authService.getStudentInfo(addr);
          if (studentInfo.courseName === this.teacherSubject) {
            const isPending = await this.authService.isPending(addr);
            if (isPending) {
              pendingList.push({ address: addr, ...studentInfo });
            } else {
              registeredList.push({ address: addr, ...studentInfo });
            }
          }
        } catch (err) {
          console.error(`Error fetching info for student ${addr}:`, err);
        }
      }
      this.pendingStudents = pendingList;
      this.registeredStudents = registeredList;
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  // Approve a pending student
  async approveStudent(studentAddr: string): Promise<void> {
    try {
      await this.authService.approveStudent(studentAddr);
      await this.loadStudents();
    } catch (error) {
      console.error('Error approving student:', error);
    }
  }

  // Decline a pending student
  async declineStudent(studentAddr: string): Promise<void> {
    try {
      await this.authService.declineStudent(studentAddr);
      await this.loadStudents();
    } catch (error) {
      console.error('Error declining student:', error);
    }
  }

  // Remove a registered student
  async removeRegisteredStudent(studentAddr: string): Promise<void> {
    try {
      await this.authService.removeRegisteredStudent(studentAddr);
      await this.loadStudents();
    } catch (error) {
      console.error('Error removing registered student:', error);
    }
  }

  // --------------------------
  // Attendance Request Functionality
  // --------------------------

  // Load all attendance requests created by the teacher and, for each, build lists of marked and unmarked students.
  // async loadAttendanceRequests(): Promise<void> {
  //   try {
  //     // Retrieve all attendance requests from the contract
  //     const requests: any[] = await this.authService.getAllAttendanceRequests();
  //     const teacherAddr = this.authService.getUserAddress();
  //     // Filter for requests created by this teacher and that are active
  //     const myRequests = requests.filter(req => req.teacher.toLowerCase() === teacherAddr.toLowerCase() && req.active);
      
  //     const allStudentAddresses = await this.authService.getAllStudents();
  //     const requestsView: AttendanceRequestView[] = [];
      
  //     for (const req of myRequests) {
  //       const markedStudents: StudentInfo[] = [];
  //       const unmarkedStudents: StudentInfo[] = [];
  //       // For each student in the teacher's course, check if they've marked attendance for this request
  //       for (const addr of allStudentAddresses) {
  //         try {
  //           const studentInfo = await this.authService.getStudentInfo(addr);
  //           if (studentInfo.courseName === this.teacherSubject) {
  //             const marked = await this.authService.isAttendanceMarkedForRequest(req.id, addr);
  //             if (marked) {
  //               markedStudents.push({ address: addr, ...studentInfo });
  //             } else {
  //               unmarkedStudents.push({ address: addr, ...studentInfo });
  //             }
  //           }
  //         } catch (e) {
  //           console.error(`Error loading info for student ${addr}:`, e);
  //         }
  //       }
  //       requestsView.push({
  //         id: req.id,
  //         deadline: req.deadline,
  //         markedStudents,
  //         unmarkedStudents
  //       });
  //     }
  //     this.attendanceRequestsView = requestsView;
  //   } catch (error) {
  //     console.error('Error loading attendance requests:', error);
  //   }
  // }

  // async loadAttendanceRequests(): Promise<void> {
  //   try {
  //     // Retrieve all attendance requests from the contract
  //     const requests: any[] = await this.authService.getAllAttendanceRequests();
  //     const teacherAddr = this.authService.getUserAddress();
  
  //     // Filter for requests created by this teacher and that are active
  //     const myRequests = requests.filter(
  //       req => req.teacher.toLowerCase() === teacherAddr.toLowerCase() && req.active
  //     );
  
  //     // We'll combine the data from all requests into single arrays
  //     this.allMarked = [];
  //     this.allUnmarked = [];
  
  //     const allStudentAddresses = await this.authService.getAllStudents();
  
  //     // For each request, gather students who have or haven't marked attendance
  //     for (const req of myRequests) {
  //       for (const addr of allStudentAddresses) {
  //         try {
  //           const studentInfo = await this.authService.getStudentInfo(addr);
  //           if (studentInfo.courseName === this.teacherSubject) {
  //             // Check if this student has marked attendance for *this* request
  //             const marked = await this.authService.isAttendanceMarkedForRequest(req.id, addr);
  //             if (marked) {
  //               // If not already in the allMarked array, push it
  //               // (Optional: you can skip duplicates if needed)
  //               if (!this.allMarked.find(s => s.address === addr)) {
  //                 this.allMarked.push({ address: addr, ...studentInfo });
  //               }
  //             } else {
  //               // If not already in allUnmarked, push it
  //               if (!this.allUnmarked.find(s => s.address === addr)) {
  //                 this.allUnmarked.push({ address: addr, ...studentInfo });
  //               }
  //             }
  //           }
  //         } catch (e) {
  //           console.error(`Error loading info for student ${addr}:`, e);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error loading attendance requests:', error);
  //   }
  // }


  

async loadAttendanceRequests(): Promise<void> {
  try {
    const requests: any[] = await this.authService.getAllAttendanceRequests();
    const teacherAddr = this.authService.getUserAddress();
    // Filter for requests created by this teacher and active
    const myRequests = requests.filter(
      req => req.teacher.toLowerCase() === teacherAddr.toLowerCase() && req.active
    );

    // Clear existing arrays
    this.allMarked = [];
    this.allUnmarked = [];

    const allStudentAddresses = await this.authService.getAllStudents();

    // For each request, gather data
    for (const req of myRequests) {
      for (const addr of allStudentAddresses) {
        try {
          const studentInfo = await this.authService.getStudentInfo(addr);
          if (studentInfo.courseName === this.teacherSubject) {
            // Check if student marked attendance for *this* request
            const marked = await this.authService.isAttendanceMarkedForRequest(req.id, addr);
            if (marked) {
              // Retrieve the time they marked attendance
              const markTime = await this.authService.getMarkedTime(req.id, addr);

              // Create a CombinedAttendanceInfo object
              const combined: CombinedAttendanceInfo = {
                address: addr,
                name: studentInfo.name,
                rollNo: studentInfo.rollNo,
                attendance: studentInfo.attendance,
                requestId: req.id,
                deadline: req.deadline,
                markedTime: Number(markTime)
              };

              // Optionally check for duplicates if you only want one row per student
              this.allMarked.push(combined);
            } else {
              // If not marked, push into unmarked
              const combined: CombinedAttendanceInfo = {
                address: addr,
                name: studentInfo.name,
                rollNo: studentInfo.rollNo,
                attendance: studentInfo.attendance,
                requestId: req.id,
                deadline: req.deadline
              };
              this.allUnmarked.push(combined);
            }
          }
        } catch (e) {
          console.error(`Error loading info for student ${addr}:`, e);
        }
      }
    }
  } catch (error) {
    console.error('Error loading attendance requests:', error);
  }
}



  // Create a new attendance request using the newDeadline (datetime-local value)
  async createRequest(): Promise<void> {
    try {
      // Convert the datetime-local string to a Unix timestamp (seconds)
      const deadlineTimestamp = Math.floor(new Date(this.newDeadline).getTime() / 1000);
      await this.authService.createAttendanceRequest(deadlineTimestamp);
      // Clear the input field and reload attendance requests
      this.newDeadline = '';
      await this.loadAttendanceRequests();
    } catch (error) {
      console.error('Error creating attendance request:', error);
    }
  }

  // Deny attendance for a student in a given request
  async denyAttendance(requestId: number, studentAddr: string): Promise<void> {
    try {
      await this.authService.denyAttendance(requestId, studentAddr);
      await this.loadAttendanceRequests();
    } catch (error) {
      console.error('Error denying attendance:', error);
    }
  }

  

}
