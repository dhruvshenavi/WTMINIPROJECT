
// pragma solidity ^0.8.19;

// contract Attendance {
//     address public superAdmin;

//     struct Admin {
//         bool isActive;
//         string role;
//         string subjectOrBatch;
//     }

//     struct Student {
//         bool isRegistered;
//         string name;
//         string rollNo;
//         address addedBy;
//         uint256 totalAttendance;
//         mapping(uint256 => bool) attendanceByDate;
//     }

//     mapping(address => Admin) public admins;
//     mapping(address => Student) private students;
//     mapping(address => bool) public pendingApprovals;
//     mapping(uint256 => address[]) public attendanceLogByDate;

//     uint256 public lastAllowedDate;

//     // Events
//     event AdminAdded(address indexed admin, string role);
//     event StudentRequested(address indexed student);
//     event StudentApproved(address indexed student);
//     event AttendanceMarked(address indexed student, uint256 date);
//     event RewardIssued(address indexed student, uint256 reward);
//     event MissedAttendance(address indexed student, uint256 date);

//     constructor() {
//         superAdmin = msg.sender;
//         admins[msg.sender] = Admin(true, "super_admin", "all");
//     }

//     // Modifiers
//     modifier onlySuperAdmin() {
//         require(msg.sender == superAdmin, "Only Super Admin");
//         _;
//     }

//     modifier onlyAdmin() {
//         require(admins[msg.sender].isActive, "Not an authorized admin");
//         _;
//     }

//     modifier onlyRegisteredStudent() {
//         require(students[msg.sender].isRegistered, "Not a registered student");
//         _;
//     }

//     modifier notLocked(uint256 date) {
//         require(date < lastAllowedDate, "Attendance locked for this date");
//         _;
//     }

//     // Admin Functions
//     function addAdmin(address _admin, string memory _role, string memory _subjectOrBatch) public onlySuperAdmin {
//         require(!admins[_admin].isActive, "Admin already exists");
//         admins[_admin] = Admin(true, _role, _subjectOrBatch);
//         emit AdminAdded(_admin, _role);
//     }

//     // 🎓 Student Self-Registration with rollNo
//     function requestRegistration(string memory name, string memory rollNo) public {
//         require(!students[msg.sender].isRegistered, "Already registered");
//         require(!pendingApprovals[msg.sender], "Already requested");

//         pendingApprovals[msg.sender] = true;
//         students[msg.sender].name = name;
//         students[msg.sender].rollNo = rollNo;

//         emit StudentRequested(msg.sender);
//     }

//     // ✅ Admin approves student
//     function approveStudent(address studentAddr) public onlyAdmin {
//         require(pendingApprovals[studentAddr], "No pending request");

//         students[studentAddr].isRegistered = true;
//         students[studentAddr].addedBy = msg.sender;
//         students[studentAddr].totalAttendance = 0;

//         delete pendingApprovals[studentAddr];

//         emit StudentApproved(studentAddr);
//     }

//     // 📅 Mark Attendance
//     function markAttendance(uint256 date) public onlyRegisteredStudent notLocked(date) {
//         require(!students[msg.sender].attendanceByDate[date], "Already marked");

//         students[msg.sender].attendanceByDate[date] = true;
//         students[msg.sender].totalAttendance += 1;

//         attendanceLogByDate[date].push(msg.sender);

//         emit AttendanceMarked(msg.sender, date);

//         if (students[msg.sender].totalAttendance % 5 == 0) {
//             _issueReward(msg.sender);
//         }
//     }

//     // 🔐 Admin sets lock date
//     function setLastAllowedDate(uint256 date) public onlyAdmin {
//         lastAllowedDate = date;
//     }

//     // 🎁 Internal reward
//     function _issueReward(address student) internal {
//         emit RewardIssued(student, 10);
//     }

//     // 📊 View Functions
//     function isStudentRegistered(address studentAddr) public view returns (bool) {
//         return students[studentAddr].isRegistered;
//     }

//     function getTotalAttendance(address studentAddr) public view returns (uint256) {
//         return students[studentAddr].totalAttendance;
//     }

//     function hasMarkedAttendance(address studentAddr, uint256 date) public view returns (bool) {
//         return students[studentAddr].attendanceByDate[date];
//     }

//     function getAttendeesOnDate(uint256 date) public view returns (address[] memory) {
//         return attendanceLogByDate[date];
//     }

//     function getFullAttendanceLog(uint256[] memory dates) public view returns (bool[] memory) {
//         bool[] memory logs = new bool[](dates.length);
//         for (uint256 i = 0; i < dates.length; i++) {
//             logs[i] = students[msg.sender].attendanceByDate[dates[i]];
//         }
//         return logs;
//     }

//     function checkMissedAttendance(uint256 date) public {
//         require(!students[msg.sender].attendanceByDate[date], "Attendance already marked");
//         emit MissedAttendance(msg.sender, date);
//     }

//     function getUserRole(address user) public view returns (string memory) {
//         if (user == superAdmin) {
//             return "admin";
//         } else if (admins[user].isActive) {
//             return admins[user].role;
//         } else if (students[user].isRegistered) {
//             return "student";
//         } else if (pendingApprovals[user]) {
//             return "pending";
//         } else {
//             return "none";
//         }
//     }

//     // ✅ New: Get student info (viewable details)
//     function getStudentInfo(address studentAddr) public view returns (string memory name, string memory rollNo, uint256 attendance) {
//         require(
//             students[studentAddr].isRegistered || pendingApprovals[studentAddr],
//             "Student not found"
//         );
//         return (
//             students[studentAddr].name,
//             students[studentAddr].rollNo,
//             students[studentAddr].totalAttendance
//         );
//     }
// }



// pragma solidity ^0.8.19;

// contract Attendance {
//     address public superAdmin;

//     struct Admin {
//         bool isActive;
//         string role;
//         string subjectOrBatch;
//     }

//     struct Student {
//         bool isRegistered;
//         string name;
//         string rollNo;
//         string courseName; // New field to store course name
//         address addedBy;
//         uint256 totalAttendance;
//         mapping(uint256 => bool) attendanceByDate;
//     }

//     mapping(address => Admin) public admins;
//     mapping(address => Student) private students;
//     mapping(address => bool) public pendingApprovals;
//     mapping(uint256 => address[]) public attendanceLogByDate;

//     uint256 public lastAllowedDate;

//     // Events
//     event AdminAdded(address indexed admin, string role);
//     event StudentRequested(address indexed student, string courseName); // Updated to include course name
//     event StudentApproved(address indexed student);
//     event AttendanceMarked(address indexed student, uint256 date);
//     event RewardIssued(address indexed student, uint256 reward);
//     event MissedAttendance(address indexed student, uint256 date);

//     constructor() {
//         superAdmin = msg.sender;
//         admins[msg.sender] = Admin(true, "super_admin", "all");
//     }

//     // Modifiers
//     modifier onlySuperAdmin() {
//         require(msg.sender == superAdmin, "Only Super Admin");
//         _;
//     }

//     modifier onlyAdmin() {
//         require(admins[msg.sender].isActive, "Not an authorized admin");
//         _;
//     }

//     modifier onlyRegisteredStudent() {
//         require(students[msg.sender].isRegistered, "Not a registered student");
//         _;
//     }

//     modifier notLocked(uint256 date) {
//         require(date < lastAllowedDate, "Attendance locked for this date");
//         _;
//     }

//     // Admin Functions
//     function addAdmin(address _admin, string memory _role, string memory _subjectOrBatch) public onlySuperAdmin {
//         require(!admins[_admin].isActive, "Admin already exists");
//         admins[_admin] = Admin(true, _role, _subjectOrBatch);
//         emit AdminAdded(_admin, _role);
//     }

//     // 🎓 Student Self-Registration with courseName
//     function requestRegistration(string memory name, string memory rollNo, string memory courseName) public {
//         require(!students[msg.sender].isRegistered, "Already registered");
//         require(!pendingApprovals[msg.sender], "Already requested");

//         pendingApprovals[msg.sender] = true;
//         students[msg.sender].name = name;
//         students[msg.sender].rollNo = rollNo;
//         students[msg.sender].courseName = courseName; // Store course name

//         emit StudentRequested(msg.sender, courseName);
//     }

//     // ✅ Admin approves student
//     function approveStudent(address studentAddr) public onlyAdmin {
//         require(pendingApprovals[studentAddr], "No pending request");

//         students[studentAddr].isRegistered = true;
//         students[studentAddr].addedBy = msg.sender;
//         students[studentAddr].totalAttendance = 0;

//         delete pendingApprovals[studentAddr];

//         emit StudentApproved(studentAddr);
//     }

//     // 📅 Mark Attendance
//     function markAttendance(uint256 date) public onlyRegisteredStudent notLocked(date) {
//         require(!students[msg.sender].attendanceByDate[date], "Already marked");

//         students[msg.sender].attendanceByDate[date] = true;
//         students[msg.sender].totalAttendance += 1;

//         attendanceLogByDate[date].push(msg.sender);

//         emit AttendanceMarked(msg.sender, date);

//         if (students[msg.sender].totalAttendance % 5 == 0) {
//             _issueReward(msg.sender);
//         }
//     }

//     // 🔐 Admin sets lock date
//     function setLastAllowedDate(uint256 date) public onlyAdmin {
//         lastAllowedDate = date;
//     }

//     // 🎁 Internal reward
//     function _issueReward(address student) internal {
//         emit RewardIssued(student, 10);
//     }

//     // 📊 View Functions
//     function isStudentRegistered(address studentAddr) public view returns (bool) {
//         return students[studentAddr].isRegistered;
//     }

//     function getTotalAttendance(address studentAddr) public view returns (uint256) {
//         return students[studentAddr].totalAttendance;
//     }

//     function hasMarkedAttendance(address studentAddr, uint256 date) public view returns (bool) {
//         return students[studentAddr].attendanceByDate[date];
//     }

//     function getAttendeesOnDate(uint256 date) public view returns (address[] memory) {
//         return attendanceLogByDate[date];
//     }

//     function getFullAttendanceLog(uint256[] memory dates) public view returns (bool[] memory) {
//         bool[] memory logs = new bool[](dates.length);
//         for (uint256 i = 0; i < dates.length; i++) {
//             logs[i] = students[msg.sender].attendanceByDate[dates[i]];
//         }
//         return logs;
//     }

//     function checkMissedAttendance(uint256 date) public {
//         require(!students[msg.sender].attendanceByDate[date], "Attendance already marked");
//         emit MissedAttendance(msg.sender, date);
//     }

//     function getUserRole(address user) public view returns (string memory) {
//         if (user == superAdmin) {
//             return "admin";
//         } else if (admins[user].isActive) {
//             return admins[user].role;
//         } else if (students[user].isRegistered) {
//             return "student";
//         } else if (pendingApprovals[user]) {
//             return "pending";
//         } else {
//             return "none";
//         }
//     }

//     // ✅ New: Get student info (viewable details)
//     function getStudentInfo(address studentAddr) public view returns (string memory name, string memory rollNo, string memory courseName, uint256 attendance) {
//         require(
//             students[studentAddr].isRegistered || pendingApprovals[studentAddr],
//             "Student not found"
//         );
//         return (
//             students[studentAddr].name,
//             students[studentAddr].rollNo,
//             students[studentAddr].courseName, // Return course name
//             students[studentAddr].totalAttendance
//         );
//     }
// }
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Attendance {
    address public superAdmin;

    struct Admin {
        bool isActive;
        string role;
        string subjectOrBatch;
    }

    struct Student {
        bool isRegistered;
        string name;
        string rollNo;
        string courseName; // New field to store course name
        address addedBy;
        uint256 totalAttendance;
        mapping(uint256 => bool) attendanceByDate;
    }

    // Represents a single attendance request created by a teacher.
    struct AttendanceRequest {
    uint256 id;
    address teacher;       // Who created the request
    uint256 deadline;      // Timestamp by which students must mark attendance
    bool active;           // Whether this request is still open
    }

    mapping(address => Admin) public admins;
    mapping(address => Student) private students;
    mapping(address => bool) public pendingApprovals;
    mapping(uint256 => address[]) public attendanceLogByDate;
    //  Mapping: For each attendance request ID, track if a student marked attendance.
    mapping(uint256 => mapping(address => bool)) public requestAttendance;
    mapping(uint256 => mapping(address => uint256)) public markedTime; // requestId => student => block.timestamp


    uint256 public lastAllowedDate;
    address[] public adminAddresses;
    address[] public allStudents;
    // Array of all attendance requests.
    AttendanceRequest[] public attendanceRequests;
    // A counter to generate unique request IDs.
    uint256 public nextRequestId = 1;


    // Events
    event AdminAdded(address indexed admin, string role);
    event StudentRequested(address indexed student, string courseName); // Updated to include course name
    event StudentApproved(address indexed student);
    event AttendanceMarked(address indexed student, uint256 indexed id);
    event RewardIssued(address indexed student, uint256 reward);
    event MissedAttendance(address indexed student, uint256 date);
    event AdminRemoved(address indexed admin);
    // Add a new event for when a student is removed
    event StudentRemoved(address indexed student);
    event AttendanceRequestCreated(uint256 indexed id, address indexed teacher, uint256 deadline);
    event AttendanceDenied(uint256 indexed requestId, address indexed student);



    constructor() {
        superAdmin = msg.sender;
        admins[msg.sender] = Admin(true, "super_admin", "all");
    }

    // Modifiers
    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Only Super Admin");
        _;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender].isActive, "Not an authorized admin");
        _;
    }

    modifier onlyRegisteredStudent() {
        require(students[msg.sender].isRegistered, "Not a registered student");
        _;
    }

    modifier notLocked(uint256 date) {
        require(date < lastAllowedDate, "Attendance locked for this date");
        _;
    }

    // Admin Functions
    function addAdmin(address _admin, string memory _role, string memory _subjectOrBatch) public onlySuperAdmin {
        require(!admins[_admin].isActive, "Admin already exists");
        admins[_admin] = Admin(true, _role, _subjectOrBatch);
        
        // Add to array for easy retrieval
        adminAddresses.push(_admin);

        emit AdminAdded(_admin, _role);
    }

    function getAllAdmins() public view returns (address[] memory) {
        return adminAddresses;
    }


    // Admin function to remove a teacher
    // function removeAdmin(address _admin) public onlySuperAdmin {
    //     require(admins[_admin].isActive, "Admin does not exist");
    //     admins[_admin].isActive = false; // Deactivate teacher
    //     emit AdminRemoved(_admin);
    // }

    function removeAdmin(address _admin) public onlySuperAdmin {
    require(admins[_admin].isActive, "Admin does not exist");
    admins[_admin].isActive = false; // Deactivate teacher

    // Remove the address from the adminAddresses array:
    for (uint i = 0; i < adminAddresses.length; i++) {
        if (adminAddresses[i] == _admin) {
            adminAddresses[i] = adminAddresses[adminAddresses.length - 1];
            adminAddresses.pop();
            break;
        }
    }

    emit AdminRemoved(_admin);
}

    // Get the teacher details
    function getTeacher(address _admin) public view returns (string memory, string memory) {
        require(admins[_admin].isActive, "Teacher does not exist");
        return (admins[_admin].role, admins[_admin].subjectOrBatch);
    }

    // 🎓 Student Self-Registration with courseName
    // function requestRegistration(string memory name, string memory rollNo, string memory courseName) public {
    //     require(!students[msg.sender].isRegistered, "Already registered");
    //     require(!pendingApprovals[msg.sender], "Already requested");

    //     pendingApprovals[msg.sender] = true;
    //     students[msg.sender].name = name;
    //     students[msg.sender].rollNo = rollNo;
    //     students[msg.sender].courseName = courseName; // Store course name

    //     emit StudentRequested(msg.sender, courseName);
    // }

    function requestRegistration(string memory name, string memory rollNo, string memory courseName) public {
    require(!students[msg.sender].isRegistered, "Already registered");
    require(!pendingApprovals[msg.sender], "Already requested");

    // Mark them as pending
    pendingApprovals[msg.sender] = true;

    // Fill out the Student struct
    students[msg.sender].name = name;
    students[msg.sender].rollNo = rollNo;
    students[msg.sender].courseName = courseName;

    // Push to the array so we can iterate later
    allStudents.push(msg.sender);

    emit StudentRequested(msg.sender, courseName);
}


    // ✅ Admin approves student
    function approveStudent(address studentAddr) public onlyAdmin {
        require(pendingApprovals[studentAddr], "No pending request");

        students[studentAddr].isRegistered = true;
        students[studentAddr].addedBy = msg.sender;
        students[studentAddr].totalAttendance = 0;

        delete pendingApprovals[studentAddr];

        emit StudentApproved(studentAddr);
    }

    function removeRegisteredStudent(address studentAddr) public onlyAdmin {
    require(students[studentAddr].isRegistered, "Student is not registered");
    // Mark the student as not registered and reset their attendance count
    students[studentAddr].isRegistered = false;
    students[studentAddr].totalAttendance = 0;
    emit StudentRemoved(studentAddr);
    }

    // 📅 Mark Attendance
    function markAttendance(uint256 date) public onlyRegisteredStudent notLocked(date) {
        require(!students[msg.sender].attendanceByDate[date], "Already marked");

        students[msg.sender].attendanceByDate[date] = true;
        students[msg.sender].totalAttendance += 1;

        attendanceLogByDate[date].push(msg.sender);

        emit AttendanceMarked(msg.sender, date);

        if (students[msg.sender].totalAttendance % 5 == 0) {
            _issueReward(msg.sender);
        }
    }

    function createAttendanceRequest(uint256 deadline) public onlyAdmin {
    require(deadline > block.timestamp, "Deadline must be in the future");
    
    AttendanceRequest memory newRequest = AttendanceRequest({
        id: nextRequestId,
        teacher: msg.sender,
        deadline: deadline,
        active: true
    });
    
    attendanceRequests.push(newRequest);
    nextRequestId++;
    
    // Optionally, emit an event like:
    emit AttendanceRequestCreated(newRequest.id, msg.sender, deadline);
    }

    // function markAttendanceForRequest(uint256 requestId) public {
    // require(students[msg.sender].isRegistered, "Not a registered student");

    // // Find the attendance request
    // bool found = false;
    // AttendanceRequest memory req;
    // for (uint256 i = 0; i < attendanceRequests.length; i++) {
    //     if (attendanceRequests[i].id == requestId) {
    //         req = attendanceRequests[i];
    //         found = true;
    //         break;
    //     }
    // }
    // require(found, "Attendance request not found");
    // require(req.active, "Request is not active");
    // require(block.timestamp <= req.deadline, "Deadline passed");
    // require(!requestAttendance[requestId][msg.sender], "Already marked attendance for this request");

    // // Mark attendance for this request.
    // requestAttendance[requestId][msg.sender] = true;
    // // Increment the student's overall attendance count.
    // students[msg.sender].totalAttendance += 1;

    // emit AttendanceMarked(msg.sender, requestId);
    // }


    function markAttendanceForRequest(uint256 requestId) public {
    require(students[msg.sender].isRegistered, "Not a registered student");

    // Find the attendance request
    bool found = false;
    AttendanceRequest memory req;
    uint256 index;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].id == requestId) {
            req = attendanceRequests[i];
            found = true;
            index = i;
            break;
        }
    }
    require(found, "Attendance request not found");
    require(req.active, "Request is not active");
    require(block.timestamp <= req.deadline, "Deadline passed");
    require(!requestAttendance[requestId][msg.sender], "Already marked attendance for this request");

    // Mark attendance for this request.
    requestAttendance[requestId][msg.sender] = true;
    // Store the time the student marked
    markedTime[requestId][msg.sender] = block.timestamp;

    // Increment the student's overall attendance count.
    students[msg.sender].totalAttendance += 1;

    emit AttendanceMarked(msg.sender, requestId);
}



    function denyAttendance(uint256 requestId, address studentAddr) public onlyAdmin {
    // Find the attendance request.
    bool found = false;
    AttendanceRequest memory req;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].id == requestId) {
            req = attendanceRequests[i];
            found = true;
            break;
        }
    }
    require(found, "Attendance request not found");
    // Only the teacher who created the request can deny attendance.
    require(req.teacher == msg.sender, "Not authorized for this request");
    require(requestAttendance[requestId][studentAddr], "Attendance not marked");

    // Remove the attendance mark.
    requestAttendance[requestId][studentAddr] = false;
    // Decrement the student's attendance count if above zero.
    if (students[studentAddr].totalAttendance > 0) {
        students[studentAddr].totalAttendance -= 1;
    }

    // Optionally, emit an event:
    emit AttendanceDenied(requestId, studentAddr);
}



    // 🔐 Admin sets lock date
    function setLastAllowedDate(uint256 date) public onlyAdmin {
        lastAllowedDate = date;
    }

    // 🎁 Internal reward
    function _issueReward(address student) internal {
        emit RewardIssued(student, 10);
    }

    // 📊 View Functions
    function isStudentRegistered(address studentAddr) public view returns (bool) {
        return students[studentAddr].isRegistered;
    }

    function getAllStudents() public view returns (address[] memory) {
    return allStudents;
}


    function getTotalAttendance(address studentAddr) public view returns (uint256) {
        return students[studentAddr].totalAttendance;
    }

    function hasMarkedAttendance(address studentAddr, uint256 date) public view returns (bool) {
        return students[studentAddr].attendanceByDate[date];
    }

    function getAttendeesOnDate(uint256 date) public view returns (address[] memory) {
        return attendanceLogByDate[date];
    }

    function getFullAttendanceLog(uint256[] memory dates) public view returns (bool[] memory) {
        bool[] memory logs = new bool[](dates.length);
        for (uint256 i = 0; i < dates.length; i++) {
            logs[i] = students[msg.sender].attendanceByDate[dates[i]];
        }
        return logs;
    }


    function declineStudent(address studentAddr) public onlyAdmin {
    require(pendingApprovals[studentAddr], "No pending request");
    delete pendingApprovals[studentAddr];
    // Optionally emit a StudentDeclined event
}


    function checkMissedAttendance(uint256 date) public {
        require(!students[msg.sender].attendanceByDate[date], "Attendance already marked");
        emit MissedAttendance(msg.sender, date);
    }

    function getUserRole(address user) public view returns (string memory) {
        if (user == superAdmin) {
            return "admin";
        } else if (admins[user].isActive) {
            return admins[user].role;
        } else if (students[user].isRegistered) {
            return "student";
        } else if (pendingApprovals[user]) {
            return "pending";
        } else {
            return "none";
        }
    }

    // ✅ New: Get student info (viewable details)
    function getStudentInfo(address studentAddr) public view returns (string memory name, string memory rollNo, string memory courseName, uint256 attendance) {
        require(
            students[studentAddr].isRegistered || pendingApprovals[studentAddr],
            "Student not found"
        );
        return (
            students[studentAddr].name,
            students[studentAddr].rollNo,
            students[studentAddr].courseName, // Return course name
            students[studentAddr].totalAttendance
        );
    }

    // Helper function: Get all attendance requests.
function getAllAttendanceRequests() public view returns (AttendanceRequest[] memory) {
    return attendanceRequests;
}


// Helper function: Get only active attendance requests.
function getActiveAttendanceRequests() public view returns (AttendanceRequest[] memory) {
    uint256 count = 0;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].active) {
            count++;
        }
    }
    AttendanceRequest[] memory activeRequests = new AttendanceRequest[](count);
    uint256 index = 0;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].active) {
            activeRequests[index] = attendanceRequests[i];
            index++;
        }
    }
    return activeRequests;
}

// Helper function: Get active attendance requests created by a specific teacher.
function getAttendanceRequestsByTeacher(address teacher) public view returns (AttendanceRequest[] memory) {
    uint256 count = 0;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].active && attendanceRequests[i].teacher == teacher) {
            count++;
        }
    }
    AttendanceRequest[] memory teacherRequests = new AttendanceRequest[](count);
    uint256 index = 0;
    for (uint256 i = 0; i < attendanceRequests.length; i++) {
        if (attendanceRequests[i].active && attendanceRequests[i].teacher == teacher) {
            teacherRequests[index] = attendanceRequests[i];
            index++;
        }
    }
    return teacherRequests;
}
}