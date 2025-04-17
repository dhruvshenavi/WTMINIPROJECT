import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: StudentDashboardComponent },  // Default or landing page
  { path: 'student-dashboard', component: StudentDashboardComponent }, // Student-specific path
  { path: 'teacher-dashboard', component: TeacherDashboardComponent }, // Teacher-specific path
  { path: 'super-admin-dashboard', component: SuperAdminDashboardComponent }, // Admin-specific path
  { path: '**', redirectTo: 'dashboard' }, // Wildcard to default
];

