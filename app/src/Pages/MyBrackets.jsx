import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Rankings from "../PageComponents/Rankings";
import Navigation from '../PageComponents/Navigation';
import '../styling/JoinPool.css'
import { getMyBrackets } from "../helpers/contractFunctions";

const provider = new ethers.BrowserProvider(window.ethereum);

function MyBrackets({ address }) {
    const location = useLocation();
    const { poolAddress } = useParams();
    const { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } = location.state || {};
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [noEntries, setNoEntries] = useState(false);
    const [myBrackets, setMyBrackets] = useState();
    const [winner, setWinner] = useState();
    const [isChampComplete, setIsChampComplete] = useState(false);

    const updateSemiWinnerLeft = (semiWinnerLeftData) => {
        setSemiWinnerLeft(semiWinnerLeftData);
    };

    const updateSemiWinnerRight = (semiWinnerRightData) => {
        setSemiWinnerRight(semiWinnerRightData);
    };

    const updateChampion = (championData) => {
        setChampion(championData);
    };

    const updateFinalScoreLeft = (finalScoreLeftData) => {
        setFinalScoreLeft(finalScoreLeftData);
    };

    const updateFinalScoreRight = (finalScoreRightData) => {
        setFinalScoreRight(finalScoreRightData);
    };

    async function connectWallet() {
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setSigner(await provider.getSigner());
    }

    useEffect(() => {
        async function getPoolInformation() {
            try {
                let myBracketsResult = await getMyBrackets(signer, poolAddress);
                if (myBracketsResult[1] !== '') {
                    setError(myBracketsResult[1]);
                } else if (myBracketsResult[0][0].length === 0) {
                    setNoEntries(true);
                } else {
                    let sorted = [...myBracketsResult[0][0]].sort((x, y) => ethers.getNumber(y[5]) - ethers.getNumber(x[5]));
                    let stringified = [...myBracketsResult[2]].map(w => w.toString());
                    let w = sorted.filter((b) => stringified.includes(b[6].toString()));
                    let l = sorted.filter((b) => !stringified.includes(b[6].toString()));
                    let wSorted = w.concat(l);
                    setWinner(stringified);
                    setMyBrackets(wSorted);
                }
            } catch (error) {
                console.error("Error fetching pool information:", error);
                console.log(error);
            }
        }

        async function fetchData() {
            const promises = await getPoolInformation();

            try {
                await Promise.resolve(promises);
                setDataLoaded(true);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }
        fetchData();
    }, [poolAddress, signer, dataLoaded]);

    useEffect(() => {
        console.log("State after update:", {
            myBrackets,
        });
    }, [myBrackets]);

    return (
        <>
            <Navigation />
            <div className='homeCFPTeamsContainer'>
                {rankings && (
                    <div>
                        <Rankings rankings={rankings} champTeamOne={champTeamOne} champTeamTwo={champTeamTwo} nationalChamp={nationalChamp} cTeamOneScore={cTeamOneScore} cTeamTwoScore={cTeamTwoScore} isEntry={false} isChampComplete={isChampComplete} updateSemiWinnerLeft={updateSemiWinnerLeft} updateSemiWinnerRight={updateSemiWinnerRight} updateChampion={updateChampion} updateFinalScoreLeft={updateFinalScoreLeft} updateFinalScoreRight={updateFinalScoreRight} />
                    </div>
                )}
            </div>
            <div className='belowRankingsContainer'>
                <div className='standingsContainer'>
                    {(() => {
                        if (account === undefined) {
                            return (
                                <>
                                    <div className='centerConnectWalletDiv'>
                                        <div className='connectWalletDiv'>
                                            <div className='connectWalletButtonDiv'>
                                                <button type='button' onClick={connectWallet} className='connectWalletButton homeInteractButton'>Connect Wallet</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (error !== null) {
                            return (
                                <>
                                    <div className='centerConnectWalletDiv'>
                                        <div className='errorMessageDiv'>
                                            <div className='errorMessage'>{error}</div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th scope='col'>Address</th>
                                                <th scope='col'>Semifinal Winner</th>
                                                <th scope='col'>Semifinal Winner</th>
                                                <th scope='col'>Champion</th>
                                                <th scope='col'>Championship Total Score</th>
                                                <th scope='col'>Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myBrackets && (
                                                myBrackets.map(b => {
                                                    return (
                                                        <tr className={winner.includes(b[6].toString()) ? 'bracketWinner' : ''}>
                                                            <td scope='row'>{b[0]}</td>
                                                            <td scope='row'>{(rankings.find(t => t.id == b[1].toString()).nickname)}</td>
                                                            <td scope='row'>{(rankings.find(t => t.id == b[2].toString()).nickname)}</td>
                                                            <td scope='row'>{(rankings.find(t => t.id == b[3].toString()).nickname)}</td>
                                                            <td scope='row'>{b[4].toString()}</td>
                                                            <td scope='row'>{b[5].toString()}</td>
                                                        </tr>
                                                    )
                                                })
                                            )}
                                            {noEntries && (
                                                <tr>
                                                    <td colspan="6">No Entries.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )
                        }
                    })()}
                </div>
            </div>
        </>
    );
}

export default MyBrackets;