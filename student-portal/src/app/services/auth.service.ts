import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  provider!: ethers.BrowserProvider;
  signer!: ethers.JsonRpcSigner;
  contract!: ethers.Contract;

  userAddress: string = '';
  loggedIn: boolean = false;
  userRole: string = '';

  // ✅ Observable to notify components of role changes
  roleChanged = new BehaviorSubject<string>('');

  constructor() {
    this.checkWalletConnected();
  }

  // async init() {
  //   if (!this.provider) {
  //     this.provider = new ethers.BrowserProvider((window as any).ethereum);
  //     this.signer = await this.provider.getSigner();
  //   }
  //   if (!this.contract) {
  //     this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
  //   }
  // }

  async init() {
    if (!this.provider) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
    }
    // Always retrieve the signer freshly to ensure it supports transactions
    this.signer = await this.provider.getSigner();
    // Always reinitialize the contract with the signer so it supports sending transactions
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
  }
  

  async checkWalletConnected() {
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await this.provider.send('eth_accounts', []);
      if (accounts.length > 0) {
        this.signer = await this.provider.getSigner();
        this.userAddress = await this.signer.getAddress();
        this.loggedIn = true;
        await this.fetchUserRole();
      }
    }
  }

  async loginWithMetaMask() {
    if (!(window as any).ethereum) {
      alert('MetaMask is not installed!');
      return;
    }
    this.provider = new ethers.BrowserProvider((window as any).ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();
    this.userAddress = await this.signer.getAddress();
    this.loggedIn = true;
    await this.fetchUserRole();
  }

  logout() {
    this.userAddress = '';
    this.loggedIn = false;
    this.userRole = '';
    this.contract = undefined as any;

    // ✅ Clear the role for any subscribers
    this.roleChanged.next('');
  }

  async fetchUserRole() {
    await this.init();
    try {
      const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider); // ✅
      const role = await readOnlyContract['getUserRole'](this.userAddress);
      this.userRole = role;
      this.roleChanged.next(role);
      console.log(`User role: ${this.userRole}`);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  }
  

  getUserRole() {
    return this.userRole;
  }

  getUserAddress() {
    return this.userAddress;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  async requestRegistration(name: string, rollNo: string, courseName: string): Promise<void> {
    await this.init();
  
    if (!name || !rollNo || !courseName) {
      throw new Error('Name, Roll Number, and Course Name are required.');
    }
  
    const tx = await this.contract['requestRegistration'](name, rollNo, courseName);
    await tx.wait();
  }
  
  

  async debugUserState() {
    await this.init();
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider); // ✅
  
    const role = await readOnlyContract['getUserRole'](this.userAddress);
    const isRegistered = await readOnlyContract['isStudentRegistered'](this.userAddress);
    const isPending = await readOnlyContract['pendingApprovals'](this.userAddress);
  
    console.log('🧠 Wallet:', this.userAddress);
    console.log('📌 Role:', role);
    console.log('✅ Registered:', isRegistered);
    console.log('🕓 Pending:', isPending);
  }
  
  // async addAdmin(_admin: string, _role: string, _subjectOrBatch: string): Promise<void> {
  //   await this.init();
  //   const tx = await this.contract['addAdmin'](_admin, _role, _subjectOrBatch);
  //   await tx.wait();
  // }

  async addAdmin(_admin: string, _role: string, _subjectOrBatch: string): Promise<void> {
    await this.init();
    const tx = await this.contract['addAdmin'](_admin, _role, _subjectOrBatch);
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);
    // Optionally, log the count of admin addresses
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    const adminAddresses = await readOnlyContract['getAllAdmins']();
    console.log('Current admin count:', adminAddresses.length);
  }
  
  
  
  async removeAdmin(_admin: string): Promise<void> {
    await this.init();
    const tx = await this.contract['removeAdmin'](_admin);
    await tx.wait();
  }
  
  // Get list of all admin addresses
  async getAllAdmins(): Promise<string[]> {
    await this.init();
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    return await readOnlyContract['getAllAdmins']();
  }
  
  // Get details of a single teacher (role, subjectOrBatch)
  // async getTeacher(_admin: string): Promise<{ role: string; subjectOrBatch: string }> {
  //   await this.init();
  //   // This will revert if admin is inactive, so we wrap in try/catch in front-end
  //   const [role, subjectOrBatch] = await this.contract['getTeacher'](_admin);
  //   return { role, subjectOrBatch };
  // }
  async getTeacher(_admin: string): Promise<{ role: string; subjectOrBatch: string }> {
    await this.init();
    const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    const [role, subjectOrBatch] = await readOnlyContract['getTeacher'](_admin);
    return { role, subjectOrBatch };
  }
  

  // Check if a student is still pending registration
async isPending(studentAddr: string): Promise<boolean> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  return await readOnlyContract['pendingApprovals'](studentAddr);
}

// Check if a student is registered (already exists in your contract, but if needed as a helper)
async isStudentRegistered(studentAddr: string): Promise<boolean> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  return await readOnlyContract['isStudentRegistered'](studentAddr);
}

// (Optional) Remove a registered student – you’ll need to implement this function in your contract.
// For now, we assume you have added it as removeRegisteredStudent in your contract.
async removeRegisteredStudent(studentAddr: string): Promise<void> {
  await this.init();
  const tx = await this.contract['removeRegisteredStudent'](studentAddr);
  await tx.wait();
}

// Approve a pending student
async approveStudent(studentAddr: string): Promise<void> {
  await this.init();
  const tx = await this.contract['approveStudent'](studentAddr);
  await tx.wait();
}

// Decline a pending student
async declineStudent(studentAddr: string): Promise<void> {
  await this.init();
  const tx = await this.contract['declineStudent'](studentAddr);
  await tx.wait();
}

// Retrieve all student addresses (as stored in the allStudents array)
async getAllStudents(): Promise<string[]> {
  await this.init();
  // Use a read-only instance (provider) for view calls.
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  return await readOnlyContract['getAllStudents']();
}

// Get detailed info for a specific student address
async getStudentInfo(studentAddr: string): Promise<{ name: string; rollNo: string; courseName: string; attendance: number }> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  const [name, rollNo, courseName, attendance] = await readOnlyContract['getStudentInfo'](studentAddr);
  return { name, rollNo, courseName, attendance: Number(attendance) };
}

// Create a new attendance request (called by a teacher/admin)
async createAttendanceRequest(deadline: number): Promise<void> {
  await this.init();
  const tx = await this.contract['createAttendanceRequest'](deadline);
  await tx.wait();
}

// async getAllAttendanceRequests(): Promise<any[]> {
//   await this.init();
//   const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
//   const requests = [];
//   const nextRequestIdBN = await readOnlyContract['nextRequestId']();
//   const nextRequestId = Number(nextRequestIdBN);
//   for (let i = 0; i < nextRequestId; i++) {
//     const req = await readOnlyContract['attendanceRequests'](i);
//     requests.push({
//       id: Number(req.id),
//       teacher: req.teacher,
//       deadline: Number(req.deadline),
//       active: req.active
//     });
//   }
//   return requests;
// }

// Deny a student's attendance for a specific request (called by the teacher/admin)
async denyAttendance(requestId: number, studentAddr: string): Promise<void> {
  await this.init();
  const tx = await this.contract['denyAttendance'](requestId, studentAddr);
  await tx.wait();
}

async isAttendanceMarkedForRequest(requestId: number, studentAddr: string): Promise<boolean> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  return await readOnlyContract['requestAttendance'](requestId, studentAddr);
}

async getAllAttendanceRequests(): Promise<any[]> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  return await readOnlyContract['getAllAttendanceRequests']();
}

async getMarkedTime(requestId: number, studentAddr: string): Promise<number> {
  await this.init();
  const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  const timeBN = await readOnlyContract['markedTime'](requestId, studentAddr);
  return Number(timeBN);
}


}
