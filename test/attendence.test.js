const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attendance Contract", function () {
    let Attendance, attendance;
    let superAdmin, admin, teacher, student1, student2;

    beforeEach(async function () {
        [superAdmin, admin, teacher, student1, student2] = await ethers.getSigners();
        
        // ✅ Deploy the contract
        Attendance = await ethers.getContractFactory("Attendance");
        attendance = await Attendance.deploy();
        await attendance.waitForDeployment();

        // ✅ Assign the admin role
        await attendance.addAdmin(admin.address, "teacher", "Math");

        // ✅ Ensure attendance is **unlocked** for testing
        await attendance.connect(admin).setLastAllowedDate(20250410);
    });

    it("Should set the deployer as super admin", async function () {
        expect(await attendance.superAdmin()).to.equal(superAdmin.address);
    });

    it("Super admin should add a teacher and lab assistant", async function () {
        await attendance.addAdmin(teacher.address, "lab_assistant", "Physics Lab");
        expect((await attendance.admins(teacher.address)).isActive).to.equal(true);
    });

    it("Student should request registration", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        expect(await attendance.pendingApprovals(student1.address)).to.equal(true);
    });

    it("Teacher should approve student registration", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);
        expect(await attendance.isStudentRegistered(student1.address)).to.equal(true);
    });

    it("Student should be able to mark attendance", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);

        const date = 20250401;
        await attendance.connect(student1).markAttendance(date);
        expect(await attendance.hasMarkedAttendance(student1.address, date)).to.equal(true);
    });

    it("Should prevent marking attendance for locked dates", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);

        // ❌ Lock attendance for **all future dates**
        await attendance.connect(admin).setLastAllowedDate(20250331);

        const lockedDate = 20250401;
        await expect(attendance.connect(student1).markAttendance(lockedDate))
            .to.be.revertedWith("Attendance locked for this date");
    });

    it("Student should receive a reward after 5 attendances", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);

        // ✅ Ensure attendance is unlocked
        await attendance.connect(admin).setLastAllowedDate(20250410);

        for (let i = 0; i < 4; i++) {
            await attendance.connect(student1).markAttendance(20250401 + i);
        }

        // ✅ Student marks 6th attendance, should receive a reward
        await expect(attendance.connect(student1).markAttendance(20250406))
            .to.emit(attendance, "RewardIssued")
            .withArgs(student1.address, 10);
    });

    it("Should allow exporting attendance logs", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);

        const dates = [20250401, 20250402, 20250403];
        for (let date of dates) {
            await attendance.connect(student1).markAttendance(date);
        }

        const logs = await attendance.connect(student1).getFullAttendanceLog(dates);
        expect(logs).to.deep.equal([true, true, true]);
    });

    it("Should notify students for missed attendance", async function () {
        await attendance.connect(student1).requestRegistration("John Doe");
        await attendance.connect(admin).approveStudent(student1.address);

        const missedDate = 20250401;

        await expect(attendance.connect(student1).checkMissedAttendance(missedDate))
            .to.emit(attendance, "MissedAttendance")
            .withArgs(student1.address, missedDate);
    });

});
