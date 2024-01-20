import { useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { ethers } from 'ethers';
import Rankings from "../PageComponents/Rankings";
import Navigation from '../PageComponents/Navigation';
import PlayoffPoolV2 from '../artifacts/contracts/PlayoffPoolV2.sol/PlayoffPoolV2.json';
import '../styling/JoinPool.css';
import '../styling/Bracket.css';
import { joinPool } from "../helpers/contractFunctions";
import { formatDate } from "../helpers/formatDateString";

const provider = new ethers.BrowserProvider(window.ethereum);

function JoinPool({ address }) {
    const location = useLocation();
    const { poolAddress } = useParams();
    const { rankings } = location.state || {};
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [pool, setPool] = useState();

    const [commissioner, setCommissioner] = useState();
    const [entryFee, setEntryFee] = useState();
    const [maxEntries, setMaxEntries] = useState();
    const [unlockTimestamp, setUnlockTimestamp] = useState();
    const [lockTimestamp, setLockTimestamp] = useState();
    const [semisComplete, setSemisComplete] = useState();
    const [champComplete, setChampComplete] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);

    const [semiWinnerLeft, setSemiWinnerLeft] = useState(null);
    const [semiWinnerRight, setSemiWinnerRight] = useState(null);
    const [champion, setChampion] = useState(null);
    const [finalScoreLeft, setFinalScoreLeft] = useState('');
    const [finalScoreRight, setFinalScoreRight] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hash, setHash] = useState('');

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

    function validEntry() {
        return semiWinnerLeft !== null && semiWinnerRight !== null && champion !== null && finalScoreLeft !== '' && finalScoreRight !== '';
    }

    useEffect(() => {

        async function getPoolInformation() {
            try {
                const poolContract = new ethers.Contract(poolAddress, PlayoffPoolV2.abi, provider);
                setPool(poolContract);

                const commissionerResult = await poolContract.commissioner();
                setCommissioner(commissionerResult);

                const entryFeeResult = await poolContract.entryFee();
                setEntryFee(entryFeeResult);

                const maxEntriesResult = await poolContract.maxEntries();
                setMaxEntries(maxEntriesResult);

                const unlockTimestampResult = await poolContract.unlockTimestamp();
                setUnlockTimestamp(unlockTimestampResult);

                const lockTimestampResult = await poolContract.lockTimestamp();
                setLockTimestamp(lockTimestampResult);

                const semisCompleteResult = await poolContract.semisComplete();
                setSemisComplete(semisCompleteResult);

                const champCompleteResult = await poolContract.champComplete();
                setChampComplete(champCompleteResult);

                setDataLoaded(true);
            } catch (error) {
                console.error("Error fetching pool information:", error);
            }
        }

        async function fetchData() {
            try {
                await Promise.all([
                    getPoolInformation()
                ]);

            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }
        fetchData();
    }, [poolAddress]);

    useEffect(() => {
        console.log("State after update:", {
            commissioner,
            entryFee,
            maxEntries,
            unlockTimestamp,
            lockTimestamp,
            semisComplete,
            champComplete,
        });
        console.log(Number(unlockTimestamp))
    }, [commissioner, entryFee, maxEntries, unlockTimestamp, lockTimestamp, semisComplete, champComplete, account]);

    return (
        <>
            <Navigation />
            <div className='homeCFPTeamsContainer'>
                {rankings && (
                    <div>
                        <Rankings rankings={rankings} champTeamOne={undefined} champTeamTwo={undefined} nationalChamp={undefined} isEntry={true} isChampComplete={true} updateSemiWinnerLeft={updateSemiWinnerLeft} updateSemiWinnerRight={updateSemiWinnerRight} updateChampion={updateChampion} updateFinalScoreLeft={updateFinalScoreLeft} updateFinalScoreRight={updateFinalScoreRight} />
                    </div>
                )}
            </div>
            <div className='joinPoolContent belowRankingsContainer'>
                <div className='bottomContainer'>
                    <div className='bodyLeftContainer'>
                        <div className='entrantInstructionsDiv'>
                            <p className='entrantInstructions bottomInstructions'>Pool Information</p>
                        </div>
                        <div className='entrantSelectionsDiv'>
                            <div className='entrantSelectionsSpacing'>
                                {dataLoaded ? (
                                    <>
                                        {poolAddress && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Pool Address: </div>
                                                <div className='poolValue'>{poolAddress}</div>
                                            </div>
                                        )}
                                        {commissioner && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Commissioner: </div>
                                                <div className='poolValue'>{commissioner}</div>
                                            </div>
                                        )}
                                        {entryFee && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Entry Fee:</div>
                                                <div className='poolValue'>{ethers.formatEther(entryFee)} ETH</div>
                                            </div>
                                        )}
                                        {maxEntries && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Max Entries:</div>
                                                <div className='poolValue'>{maxEntries.toString()}</div>
                                            </div>
                                        )}
                                        {unlockTimestamp && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Unlock Date:</div>
                                                <div className='poolValue'>{formatDate(Number(unlockTimestamp) * 1000)}</div>
                                            </div>
                                        )}
                                        {lockTimestamp && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Lock Date:</div>
                                                <div className='poolValue'>{formatDate(Number(lockTimestamp) * 1000)}</div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div>Loading...</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {(() => {
                        if (account !== undefined && error === '' && success === '') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <p className='entrantInstructions bottomInstructions'>Make your selections using the bracket above</p>
                                        </div>
                                        <div className='entrantSelectionsDiv entrantSelectionsDivWithButton'>
                                            <div className='entrantSelectionsSpacing'>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='semiWinnerLeft'>Semifinal Winner:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={semiWinnerLeft?.img} alt={semiWinnerLeft?.alt} />
                                                        <div className='entrantValue entrantTeamName'>{semiWinnerLeft?.winningTeamName}</div>
                                                    </div>
                                                </div>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='semiWinnerRight' >Semifinal Winner:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={semiWinnerRight?.img} alt={semiWinnerRight?.alt} />
                                                        <div className='entrantValue entrantTeamName'>{semiWinnerRight?.winningTeamName}</div>
                                                    </div>
                                                </div>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='champion' >Champion:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={champion?.img} alt={champion?.alt} />
                                                        <div className='entrantValue entrantTeamName'>{champion?.winningTeamName}</div>
                                                    </div>
                                                </div>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='finalScore'>Final Score:</div>
                                                    <div className='entrantValue entrantFinalScore'>{finalScoreLeft === '' || finalScoreRight === '' ? '' : `${finalScoreLeft} - ${finalScoreRight}`}</div>
                                                </div>
                                            </div>
                                            <div className='buttonContainer'>
                                                {!isLoading ? (
                                                    <button type='button' className='homeInteractButton' onClick={async (e) => {
                                                        if (!validEntry()) {
                                                            if (semiWinnerLeft === null) {
                                                                document.getElementById('semiWinnerLeft').style.color = 'red'
                                                            }
                                                            if (semiWinnerRight === null) {
                                                                document.getElementById('semiWinnerRight').style.color = 'red'
                                                            }
                                                            if (champion === null) {
                                                                document.getElementById('champion').style.color = 'red'
                                                            }
                                                            if (finalScoreLeft === '' || finalScoreRight === '') {
                                                                document.getElementById('finalScore').style.color = 'red'
                                                            }
                                                        } else {
                                                            setIsLoading(true);
                                                            const response = await joinPool(signer, poolAddress, semiWinnerLeft.id, semiWinnerRight.id, champion.id, Number(finalScoreLeft) + Number(finalScoreRight), entryFee);
                                                            if (response[1]) {
                                                                console.log(response);
                                                                setSuccess(response[1]);
                                                                setHash(response[0].hash);
                                                                setIsLoading(false);
                                                            } else {
                                                                console.log(response);
                                                                setError(response[2]);
                                                                setIsLoading(false);
                                                            }
                                                        }
                                                    }}>Join Pool</button>
                                                ) : (
                                                    <button type='button' className='homeInteractButton' disabled={isLoading}>Loading...</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (account !== undefined && error === '' && success === true) {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <div className='bottomInstructions successInstructions'>Success!</div>
                                        </div>
                                        <div className='entrantSelectionsDiv'>
                                            <div className='entrantSelectionsSpacing'>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel successText'>Transaction Hash:</div>
                                                    {hash && (
                                                        <div className='entrantValue successText'>{hash}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (account !== undefined && error !== '') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <div className='bottomInstructions errorInstructions'>Error!</div>
                                        </div>
                                        <div className='entrantSelectionsSpacing'>
                                            <div className='errorText'>{error}</div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <>
                                    <div className='connectWalletDiv connectWalletDivRight'>
                                        <div className='connectWalletButtonDiv'>
                                            <button type='button' onClick={connectWallet} className='connectWalletButton homeInteractButton'>Connect Wallet</button>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    })()}
                </div>
            </div>
        </>
    );
}

export default JoinPool;