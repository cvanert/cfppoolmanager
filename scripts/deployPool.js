import { ethers, upgrades } from 'ethers';
import PlayoffPoolV2 from '../artifacts/contracts/PlayoffPoolV2.sol/PlayoffPoolV2.json';

export async function deployPool(entryFee, maxEntries, teams, unlockTimestamp, lockTimestamp, semiTimestap, champTimestamp) {
    const PlayoffPoolV2 = await ethers.getContractFactory('PlayoffPoolV2');
    const proxy = await upgrades.deployProxy(PlayoffPoolV2, [ethers.parseEther(entryFee.toString()), maxEntries, teams[0], teams[1], teams[2], teams[3], unlockTimestamp, lockTimestamp, semiTimestap, champTimestamp]);
    // const proxy = await upgrades.deployProxy(PlayoffPoolV2, [ethers.parseEther('0.025'), 3, 130, 264, 251, 333, unlockTime, lockTime, semisComplete, champComplete]);
    await proxy.waitForDeployment();
    console.log(proxy);

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());

    console.log('Proxy contract address:', await proxy.getAddress());

    console.log('Implementation contract address:', implementationAddress);

    return await proxy.getAddress();
}

// main().catch((e) => {
//     console.error(e);
//     process.exitCode = 1;
// });