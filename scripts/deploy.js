const hre = require("hardhat");

async function main() {
    const Attendance = await hre.ethers.deployContract("Attendance");
    await Attendance.waitForDeployment();

    console.log(`🎉 Contract deployed at: ${await Attendance.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
