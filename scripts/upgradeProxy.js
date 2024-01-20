const { ethers, upgrades } = require('hardhat');

// NEW Proxy contract address V1: 0x1122373E4127Ae587ea284Ad98Ae3a110a16706D
// Implementation contract address: 0xa768c840B76E07CBCA83346b880e2C1864f2388C

// UPGRADED Implementation contract address: 0x056e7Bf6548a410D061F6fE4B3aDd6d1C147d907

// Make variable that can be provided by commissioner
// const proxyAddress = '0x1122373E4127Ae587ea284Ad98Ae3a110a16706D';
const proxyAddress = '0x9c2787A66E53d1d6B9D232ff5d79d7a3d7e442D0';

async function main() {
    const PlayoffPoolV2 = await ethers.getContractFactory('PlayoffPoolV2');
    const upgraded = await upgrades.upgradeProxy(proxyAddress, PlayoffPoolV2);

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);

    console.log(upgraded);

    // console.log('The current contract owner is:', await upgraded.owner());

    console.log('Implementation contract address:', implementationAddress);
}

main().catch((e) => {
    console.error(e);
    process.exitCode = 1;
});