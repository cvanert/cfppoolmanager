import { ethers } from 'ethers';
import PlayoffPool from '../artifacts/contracts/PlayoffPool.sol/PlayoffPool.json';

export async function connectToPoolContract(signer, address) {
    if (address !== null) {
        try {
            return new ethers.Contract(address, PlayoffPool.abi, signer);
        } catch (e) {
            if (ethers.isError(e, "CALL_EXCEPTION")) {
                console.log(e.reason);
            } else {
                console.log(e);
            }
        }
    }
}

export async function joinPool(signer, address, semiOneWinner, semiTwoWinner, champion, totalScore, value) {
    try {
        const pool = await connectToPoolContract(signer, address); 
        const tx = await pool.connect(signer).joinPool(semiOneWinner, semiTwoWinner, champion, totalScore, {value: value});
        await tx.wait();
        return [tx, true, ''];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return ['', false, e.reason];
        }
    }
}

export async function getEntries(signer, address) {
    try {
        const pool = await connectToPoolContract(signer, address);
        const entriesTx = await pool.connect(signer).getAllEntries();
        const winnerTx = await pool.connect(signer).getWinnerIDs();
        return [entriesTx, '', winnerTx];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return [[], e.reason, []];
        }
    }
}

export async function getMyBrackets(signer, address) {
    try {
        console.log(signer, address)
        const pool = await connectToPoolContract(signer, address);
        const myBracketsTx = await pool.connect(signer).getMyBrackets();
        const winnerTx = await pool.connect(signer).getWinnerIDs();
        return [myBracketsTx, '', winnerTx];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return [[], e.reason, []];
        }
    }
}

export async function scoreSemifinal(signer, address, semiOneWinner, semiTwoWinner) {
     try {
        console.log(signer, address, semiOneWinner, semiTwoWinner);
        const pool = await connectToPoolContract(signer, address);
        const tx = await pool.connect(signer).scoreSemifinal(semiOneWinner, semiTwoWinner);
        const receipt = await tx.wait();
        const semisScoredEvent = receipt.logs.filter(x => x.fragment.name == "ScoredSemis");
        console.log(semisScoredEvent);
        return [semisScoredEvent.length > 0, semisScoredEvent, ''];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return [false, [], e.reason];
        }
    }
}

export async function scoreFinal(signer, address, champion, totalPoints) {
    try {
        const pool = await connectToPoolContract(signer, address);
        const tx = await pool.connect(signer).scoreFinal(champion, totalPoints);
        const receipt = await tx.wait();
        const winnerEvent = receipt.logs.filter(x => x.fragment.name == "Winner");
        const winnerPaidEvent = receipt.logs.filter(x => x.fragment.name == "WinnerPaid");
        console.log(winnerEvent);
        console.log(winnerPaidEvent);
        return [winnerPaidEvent.length > 0, winnerPaidEvent, ''];
    } catch (e) {
        if (ethers.isError(e, "CALL_EXCEPTION")) {
            console.log(e.reason);
            return [false, [], e.reason];
        }
    }
}