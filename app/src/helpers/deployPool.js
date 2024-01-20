import { ethers } from 'ethers';
import PlayoffPool from '../artifacts/contracts/PlayoffPool.sol/PlayoffPool';

export async function deployPool(entryFee, maxEntries, teams, unlockTimestamp, lockTimestamp, semiTimestap, champTimestamp, signer) {
    console.log(ethers.parseEther(entryFee.toString()), maxEntries, teams[0], teams[1], teams[2], teams[3], unlockTimestamp, lockTimestamp, semiTimestap, champTimestamp, signer);
    try {
    const PlayoffPoolFactory = new ethers.ContractFactory(PlayoffPool.abi, PlayoffPool.bytecode, signer);
    
    
    const playoffPool = await PlayoffPoolFactory.deploy(ethers.parseEther(entryFee.toString()), maxEntries, teams[0], teams[1], teams[2], teams[3], unlockTimestamp, lockTimestamp, semiTimestap, champTimestamp);

    await playoffPool.waitForDeployment();
    console.log(playoffPool);
    // const proxy = await upgrades.deployProxy(PlayoffPoolV2, [ethers.parseEther('0.025'), 3, 130, 264, 251, 333, unlockTime, lockTime, semisComplete, champComplete]);
    // await proxy.waitForDeployment();
    // console.log(proxy);

    // const implementationAddress = await upgrades.erc1967.getImplementationAddress(await proxy.getAddress());

    // console.log('Proxy contract address:', await proxy.getAddress());

    // console.log('Implementation contract address:', implementationAddress);

    return [await playoffPool.getAddress(), ''];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return ['', e.reason];
        }
    }
}

// main().catch((e) => {
//     console.error(e);
//     process.exitCode = 1;
// });