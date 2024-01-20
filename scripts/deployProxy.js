const { ethers, upgrades } = require('hardhat');

// NEW Proxy contract address V0: 0xf17f01747E3f588e482AC13838f40C464293C490
// Implementation contract address: 0xD6e5e9fBf364A16F997543729A0ae42590f2Bebb

// Proxy contract address V1: 0x5B01F700F66a6Bd399237EF4058eC55c8b4CC1D9
// Implementation contract address: 0x614aac5b279735d172894522862B16D1fEa054E5

// NEW Proxy contract address V1: 0x1122373E4127Ae587ea284Ad98Ae3a110a16706D
// Implementation contract address: 0xa768c840B76E07CBCA83346b880e2C1864f2388C

async function main() {
    const unlockTime = new Date('2023-12-03T16:00:00').getTime() / 1000;
    const lockTime = new Date('2024-01-07T10:25:00').getTime() / 1000;
    const semisComplete = new Date('2024-01-07T10:26:00').getTime() / 1000;
    const champComplete = new Date('2024-01-07T10:26:00').getTime() / 1000;

    const PlayoffPoolV2 = await ethers.getContractFactory('PlayoffPoolV2');
    const proxy = await upgrades.deployProxy(PlayoffPoolV2, [ethers.parseEther('0.025'), 3, 130, 264, 251, 333, unlockTime, lockTime, semisComplete, champComplete]);
    await proxy.waitForDeployment();
    console.log(proxy);

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());

    console.log('Proxy contract address:', await proxy.getAddress());

    console.log('Implementation contract address:', implementationAddress);



}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});