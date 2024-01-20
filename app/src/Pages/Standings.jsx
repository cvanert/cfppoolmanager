import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Rankings from "../PageComponents/Rankings";
import Navigation from '../PageComponents/Navigation';
import { getEntries } from "../helpers/contractFunctions";

const provider = new ethers.BrowserProvider(window.ethereum);

function Standings({ address }) {
    const location = useLocation();
    const { poolAddress } = useParams();
    const { rankings, champTeamOne, champTeamTwo, nationalChamp, cTeamOneScore, cTeamTwoScore } = location.state || {};
    const [dataLoaded, setDataLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [entries, setEntries] = useState();
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

    useEffect(() => {
        async function getPoolInformation() {
            try {
                let entriesResult = await getEntries(provider, poolAddress);
                console.log(entriesResult);
                if (entriesResult[1] !== '') {
                    setError(entriesResult[1]);
                } else {
                    let sorted = [...entriesResult[0]].sort((x, y) => ethers.getNumber(y[5]) - ethers.getNumber(x[5]));
                    let stringified = [...entriesResult[2]].map(w => w.toString());
                    let w = sorted.filter((b) => stringified.includes(b[6].toString()));
                    let l = sorted.filter((b) => !stringified.includes(b[6].toString()));
                    let wSorted = w.concat(l);
                    setWinner(stringified);
                    setEntries(wSorted);
                }
            } catch (error) {
                console.error("Error fetching pool information:", error);
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
    }, [poolAddress, provider, dataLoaded]);

    useEffect(() => {
        console.log("State after update:", {
            entries,
        });
    }, [entries]);

    return (
        <>
            <Navigation />
            <div className='homeCFPTeamsContainer'>
                {rankings && (
                    // <div>
                        <Rankings rankings={rankings} champTeamOne={champTeamOne} champTeamTwo={champTeamTwo} nationalChamp={nationalChamp} cTeamOneScore={cTeamOneScore} cTeamTwoScore={cTeamTwoScore} isEntry={false} isChampComplete={isChampComplete} updateSemiWinnerLeft={updateSemiWinnerLeft} updateSemiWinnerRight={updateSemiWinnerRight} updateChampion={updateChampion} updateFinalScoreLeft={updateFinalScoreLeft} updateFinalScoreRight={updateFinalScoreRight} />
                    // </div>
                )}
            </div>
            <div className='belowRankingsContainer'>
                <div className='standingsContainer'>
                    {error !== null ? (
                        <>
                            <div className='errorMessageDiv'>
                                <div className='errorMessage'>{error}</div>
                            </div>
                        </>
                    ) : (
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
                                {entries && (
                                    entries.map(b => {
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
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

export default Standings;