import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Rankings from "../PageComponents/Rankings";
import Navigation from '../PageComponents/Navigation';
import PlayoffPoolV2 from '../artifacts/contracts/PlayoffPoolV2.sol/PlayoffPoolV2.json';
import { scoreSemifinal, scoreFinal } from "../helpers/contractFunctions";

const provider = new ethers.BrowserProvider(window.ethereum);

function PoolManagement({ address }) {
    const location = useLocation();
    const { poolAddress } = useParams();
    const { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } = location.state || {};
    const [account, setAccount] = useState();
    const [signer, setSigner] = useState();
    const [pool, setPool] = useState();

    // Data from Pool Contract
    const [commissioner, setCommissioner] = useState();
    const [entryFee, setEntryFee] = useState();
    const [maxEntries, setMaxEntries] = useState();
    const [totalEntries, setTotalEntries] = useState();
    const [poolPot, setPoolPot] = useState();
    const [poolSemiWinnerLeft, setPoolSemiWinnerLeft] = useState(null);
    const [poolSemiWinnerRight, setPoolSemiWinnerRight] = useState(null);
    const [champComplete, setChampComplete] = useState();
    const [isChampComplete, setIsChampComplete] = useState(false);
    const [poolChampWinner, setPoolChampWinner] = useState();
    const [poolChampTotalPoints, setPoolChampTotalPoints] = useState();
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Commissioner's Updates to Pool Contract
    const [semiWinnerLeft, setSemiWinnerLeft] = useState(null);
    const [semiWinnerRight, setSemiWinnerRight] = useState(null);
    const [champion, setChampion] = useState(null);
    const [finalScoreLeft, setFinalScoreLeft] = useState('');
    const [finalScoreRight, setFinalScoreRight] = useState('');
    const [semiError, setSemiError] = useState('');
    const [champError, setChampError] = useState('');

    // useEffect(() => {
    //     async function getAccounts() {
    //         const accounts = await provider.send('eth_requestAccounts', []);
    //         setAccount(accounts[0]);
    //         setSigner(await provider.getSigner());
    //         return accounts[0];
    //     };

    //     getAccounts();
    // }, [account]);

    async function getAccounts() {
        const accounts = await provider.send('eth_requestAccounts', []);
        setSigner(await provider.getSigner());
        return accounts[0];
    };

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

                const totalEntriesResult = await poolContract.totalEntries();
                setTotalEntries(totalEntriesResult);

                const poolPotResult = await poolContract.pot();
                setPoolPot(poolPotResult);

                // const poolPotResult = await provider.getBalance(poolAddress);
                // setPoolPot(poolPotResult);

                const poolSemiWinnerLeftResult = await poolContract.semifinalOneWinner();
                setPoolSemiWinnerLeft(poolSemiWinnerLeftResult);
                if (poolSemiWinnerLeftResult.toString() === champTeamOne?.id) {
                    setSemiWinnerLeft(champTeamOne);
                } else if (poolSemiWinnerLeftResult.toString() === champTeamTwo?.id) {
                    setSemiWinnerLeft(champTeamTwo);
                }

                const poolSemiWinnerRightResult = await poolContract.semifinalTwoWinner();
                setPoolSemiWinnerRight(poolSemiWinnerRightResult);
                if (poolSemiWinnerRightResult.toString() === champTeamOne?.id) {
                    setSemiWinnerRight(champTeamOne);
                } else if (poolSemiWinnerRightResult.toString() === champTeamTwo?.id) {
                    setSemiWinnerRight(champTeamTwo);
                }

                const champCompleteResult = await poolContract.champComplete();
                setChampComplete(champCompleteResult);

                const poolChampWinnerResult = await poolContract.champion();
                setPoolChampWinner(poolChampWinnerResult);
                if (poolChampWinnerResult.toString() === nationalChamp?.id) {
                    setChampion(nationalChamp);
                }

                const poolChampTotalPointsResult = await poolContract.championshipTotalPoints();
                setPoolChampTotalPoints(poolChampTotalPointsResult);

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
                setIsChampComplete(champComplete ? Date.now() - (ethers.getNumber(champComplete) * 1000) > 0 : false);
            } catch (e) {
                console.error("Error fetching data:", e);
            }
        }
        fetchData();
    }, [poolAddress]);

    async function getSemisWinners() {
        try {
            const poolSemiWinnerLeftResult = await pool.semifinalOneWinner();
            setPoolSemiWinnerLeft(poolSemiWinnerLeftResult);
            if (poolSemiWinnerLeftResult.toString() === champTeamOne.id) {
                setSemiWinnerLeft(champTeamOne);
            } else if (poolSemiWinnerLeftResult.toString() === champTeamTwo.id) {
                setSemiWinnerLeft(champTeamTwo);
            }

            const poolSemiWinnerRightResult = await pool.semifinalTwoWinner();
            setPoolSemiWinnerRight(poolSemiWinnerRightResult);
            if (poolSemiWinnerRightResult.toString() === champTeamOne.id) {
                setSemiWinnerRight(champTeamOne);
            } else if (poolSemiWinnerRightResult.toString() === champTeamTwo.id) {
                setSemiWinnerRight(champTeamTwo);
            }

        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    async function getChampion() {
        try {
            const poolChampWinnerResult = await pool.champion();
            setPoolChampWinner(poolChampWinnerResult);
            if (poolChampWinnerResult.toString() === nationalChamp.id) {
                setChampion(nationalChamp);
            }

            const poolChampTotalPointsResult = await pool.championshipTotalPoints();
            setPoolChampTotalPoints(poolChampTotalPointsResult);
            if (Number(poolChampTotalPointsResult.toString()) === cTeamOneScore + cTeamTwoScore) {
                setFinalScoreLeft(cTeamOneScore);
                setFinalScoreRight(cTeamTwoScore);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    }

    return (
        <>
            <Navigation />
            <div className='homeCFPTeamsContainer'>
                {rankings && (
                    <div>
                        <Rankings rankings={rankings} champTeamOne={champTeamOne} champTeamTwo={champTeamTwo} nationalChamp={nationalChamp} cTeamOneScore={cTeamOneScore} cTeamTwoScore={cTeamTwoScore} isEntry={false} isChampComplete={isChampComplete} />
                    </div>
                )}
            </div>
            <div className='belowRankingsContainer'>
                <div className='bottomContainer'>
                    <div className='bodyLeftContainer'>
                        <div className='entrantInstructionsDiv'>
                            <p className='entrantInstructions bottomInstructions'>Pool Information</p>
                        </div>
                        <div className='entrantSelectionsDiv'>
                            {dataLoaded ? (
                                <>
                                    <div className='entrantSelectionsSpacing'>
                                        {poolAddress !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Pool Address: </div>
                                                <div className='poolValue'>{poolAddress}</div>
                                            </div>
                                        )}
                                        {commissioner !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Commissioner: </div>
                                                <div className='poolValue'>{commissioner}</div>
                                            </div>
                                        )}
                                        {entryFee !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Entry Fee:</div>
                                                <div className='poolValue'>{ethers.formatEther(entryFee)} ETH</div>
                                            </div>
                                        )}
                                        {maxEntries !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Max Entries:</div>
                                                <div className='poolValue'>{maxEntries.toString()}</div>
                                            </div>
                                        )}
                                        {totalEntries !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Total Entries:</div>
                                                <div className='poolValue'>{totalEntries.toString()}</div>
                                            </div>
                                        )}
                                        {poolPot !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Pool Pot:</div>
                                                <div className='poolValue'>{ethers.formatEther(poolPot)} ETH</div>
                                            </div>
                                        )}
                                        {poolSemiWinnerLeft !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Semifinal Winner:</div>
                                                {poolSemiWinnerLeft.toString() === champTeamOne.id && (
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={semiWinnerLeft?.team?.logos[0].href} alt={semiWinnerLeft?.team?.abbreviation} />
                                                        <div className='entrantValue entrantTeamName'>{semiWinnerLeft?.team?.displayName}</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {poolSemiWinnerRight !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Semifinal Winner:</div>
                                                <div className='entrantValue entrantTeamImgContainer'>
                                                    <img className='entrantTeamImg' src={semiWinnerRight?.team?.logos[0].href} alt={semiWinnerRight?.team?.abbreviation} />
                                                    <div className='entrantValue entrantTeamName'>{semiWinnerRight?.team?.displayName}</div>
                                                </div>
                                            </div>
                                        )}
                                        {poolChampWinner !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Champion:</div>
                                                <div className='poolValue'>{poolChampWinner}</div>
                                                <div className='entrantValue entrantTeamImgContainer'>
                                                    <img className='entrantTeamImg' src={champion?.team?.logos[0].href} alt={champion?.team?.abbreviation} />
                                                    <div className='entrantValue entrantTeamName'>{champion?.team?.displayName}</div>
                                                </div>
                                            </div>
                                        )}
                                        {poolChampTotalPoints !== undefined && (
                                            <div className='poolCategoryDiv'>
                                                <div className='poolLabel'>Championship Total Points:</div>
                                                <div className='divGrid'>
                                                    <div className='poolValue shortValue'>{poolChampTotalPoints.toString() !== '0' ? poolChampTotalPoints.toString() : ''}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </div>
                    {(() => {
                        if (!dataLoaded) {
                            return (
                                <>
                                    <div className='alertTextContainer'>
                                        <div>Loading...</div>
                                    </div>
                                </>
                            )
                        } else if (signer === undefined) {
                            return (
                                <>
                                    <div className='connectWalletDiv connectWalletDivRight'>
                                        <div className='connectWalletButtonDiv'>
                                            <button type='button' onClick={getAccounts} className='connectWalletButton'>Connect Wallet</button>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (semiError !== '') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <div className='bottomInstructions errorInstructions'>Error!</div>
                                        </div>
                                        <div className='entrantSelectionsSpacing'>                                    <div className='errorText'>{semiError}</div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (champError !== '') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <div className='bottomInstructions errorInstructions'>Error!</div>
                                        </div>
                                        <div className='entrantSelectionsSpacing'>                                    <div className='errorText'>{champError}</div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (poolSemiWinnerLeft?.toString() === '0' && poolSemiWinnerRight?.toString() === '0') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <p className='entrantInstructions bottomInstructions'>Update CFP Semifinals Winners</p>
                                        </div>
                                        <div className='entrantSelectionsDiv entrantSelectionsDivWithButton'>
                                            <div className='entrantSelectionsSpacing'>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='semiWinnerLeft'>Semifinal Winner:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={champTeamOne?.team?.logos[0].href} alt={champTeamOne?.team?.abbreviation} />
                                                        <div className='entrantValue entrantTeamName'>{champTeamOne?.team?.displayName}</div>
                                                    </div>
                                                </div>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='semiWinnerRight'>Semifinal Winner:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={champTeamTwo?.team?.logos[0].href} alt={champTeamTwo?.team?.abbreviation} />
                                                        <div className='entrantValue entrantTeamName'>{champTeamTwo?.team?.displayName}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='buttonContainer'>
                                                {!isLoading ? (
                                                    <button type='button' className='homeInteractButton'
                                                        disabled={champTeamOne === undefined || champTeamTwo === undefined} onClick={async (e) => {
                                                            console.log(account);
                                                            setIsLoading(true);
                                                            const response = await scoreSemifinal(signer, poolAddress, Number(champTeamOne.id), Number(champTeamTwo.id));
                                                            if (response[0]) {
                                                                console.log(response);
                                                                getSemisWinners();
                                                                setIsLoading(false);
                                                            } else {
                                                                setSemiError(response[2]);
                                                                console.error('Error scoring Semifinals');
                                                                setIsLoading(false);
                                                            }
                                                        }}>Update Pool</button>
                                                ) : (
                                                    <button type='button' className='homeInteractButton' disabled={isLoading}>Loading...</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>)
                        } else if (poolSemiWinnerLeft?.toString() !== '0' && poolSemiWinnerRight?.toString() !== '0' && poolChampWinner?.toString() === '0') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <p className='entrantInstructions bottomInstructions'>Update CFP Champion and Final Score</p>
                                        </div>
                                        <div className='entrantSelectionsDiv entrantSelectionsDivWithButton'>
                                            <div className='entrantSelectionsSpacing'>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='champion' >Champion:</div>
                                                    <div className='entrantValue entrantTeamImgContainer'>
                                                        <img className='entrantTeamImg' src={nationalChamp?.team?.logos[0].href} alt={nationalChamp?.team?.abbreviation} />
                                                        <div className='entrantValue entrantTeamName'>{nationalChamp?.team?.displayName}</div>
                                                    </div>
                                                </div>
                                                <div className='entrantCategoryDiv'>
                                                    <div className='entrantLabel' id='finalScore'>Final Score:</div>
                                                    <div className='entrantValue'>{cTeamOneScore === undefined || cTeamTwoScore === undefined ? '' : `${cTeamOneScore} - ${cTeamTwoScore}`}</div>
                                                </div>
                                            </div>
                                            <div className='buttonContainer'>
                                                {!isLoading ? (
                                                    <button type='button'
                                                        className='homeInteractButton'
                                                        onClick={async (e) => {
                                                            console.log(account);
                                                            setIsLoading(true);
                                                            const response = await scoreFinal(signer, poolAddress, Number(nationalChamp.id), cTeamOneScore + cTeamTwoScore);
                                                            if (response[0]) {
                                                                console.log(response);
                                                                getChampion();
                                                                setIsLoading(false);
                                                            } else {
                                                                setChampError(response[2]);
                                                                console.error('Error scoring National Championship');
                                                                setIsLoading(false);
                                                            }
                                                        }}>Update Pool</button>
                                                ) : (
                                                    <button type='button' className='homeInteractButton' disabled={isLoading}>Loading...</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        } else if (poolSemiWinnerLeft?.toString() !== '0' && poolSemiWinnerRight?.toString() !== '0' && poolChampWinner?.toString() !== '0') {
                            return (
                                <>
                                    <div className='bodyRightContainer'>
                                        <div className='entrantInstructionsDiv'>
                                            <div className='bottomInstructions successInstructions'>Complete</div>
                                        </div>
                                        <div className='entrantSelectionsSpacing'>      <div className='alertText successText'>Pool Scored</div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    })()}
                </div >
            </div>
        </>
    )
}

export default PoolManagement;